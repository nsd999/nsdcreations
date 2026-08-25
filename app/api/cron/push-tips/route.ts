import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { tips } from '@/lib/tips';

// Configure Web Push keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:nsd.creations.official@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function GET(req: Request) {
  // Simple auth for cron (if you use vercel cron, you can verify authorization header, but leaving open for easy external testing)
  // Check if API keys are set
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Fetch all subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error || !subscriptions) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    const results = [];

    // 2. Loop through and send tips
    for (const sub of subscriptions) {
      // Pick a random tip that isn't the same as last_tip_id
      let randomTip;
      do {
        randomTip = tips[Math.floor(Math.random() * tips.length)];
      } while (randomTip.id === sub.last_tip_id && tips.length > 1);

      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      const payload = JSON.stringify({
        title: randomTip.title,
        body: randomTip.description,
        image: randomTip.image,
        icon: '/icon.png', // Fallback icon
        url: 'https://nsd-creations.vercel.app', // Clicking opens the site
        sound: '/notification.mp3', // Fallback sound
        type: 'tip'
      });

      try {
        await webpush.sendNotification(pushSubscription, payload);
        
        // Update last_tip_id in DB
        await supabase
          .from('push_subscriptions')
          .update({ last_tip_id: randomTip.id })
          .eq('id', sub.id);
          
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
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
