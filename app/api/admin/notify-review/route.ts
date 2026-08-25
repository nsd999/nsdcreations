import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const ADMIN_PIN = '19082008';

// Configure Web Push keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:nsd.creations.official@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || authHeader !== `Bearer ${ADMIN_PIN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { name, review } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch all subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error || !subscriptions) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    const results = [];

    // 2. Loop through and send notifications
    for (const sub of subscriptions) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      const payload = JSON.stringify({
        title: "New Client Review! 🌟",
        body: `Here's a review from one of our clients: ${name} just reviewed NSD Creations!`,
        image: null,
        icon: '/icon.png',
        url: 'https://nsdcreations.vercel.app',
        sound: '/notification-review.mp3', // Unique sonic branding for reviews
        type: 'review'
      });

      try {
        await webpush.sendNotification(pushSubscription, payload);
        results.push({ id: sub.id, status: 'success' });
      } catch (pushError: any) {
        console.error('Error sending push to', sub.endpoint, pushError);
        // If the subscription is gone/unsubscribed, we should delete it
        if (pushError.statusCode === 410 || pushError.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
          results.push({ id: sub.id, status: 'deleted' });
        } else {
          results.push({ id: sub.id, status: 'failed', error: pushError.message });
        }
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results }, { status: 200 });

  } catch (error: any) {
    console.error('Notify review error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
