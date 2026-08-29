import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { tipsData } from '@/lib/tips-data';

// Initialize web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:nsd.creations.official@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function GET(req: Request) {
  try {
    // 1. Verify this is a valid cron request (if using Vercel Cron)
    const authHeader = req.headers.get('authorization');
    // If you set CRON_SECRET in Vercel, it sends `Bearer <CRON_SECRET>`
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Initialize Supabase Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Fetch all active subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found' });
    }

    // 4. Select a random tip
    const randomTipIndex = Math.floor(Math.random() * tipsData.length);
    const tip = tipsData[randomTipIndex];
    
    // Notification Payload
    const notificationPayload = JSON.stringify({
      title: 'NSD Creations | Growth Tip',
      body: tip.title,
      icon: '/nsd-logo-black.png', // Assuming logo exists
      url: `/tips/${tip.category.toLowerCase()}/${tip.slug}`,
      type: 'tip'
    });

    // 5. Send push notifications to all subscribers
    let successCount = 0;
    let failCount = 0;

    const pushPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, notificationPayload);
        successCount++;
        
        // Optionally update last_tip_id
        await supabase
          .from('push_subscriptions')
          .update({ last_tip_id: parseInt(tip.id, 10) || randomTipIndex })
          .eq('endpoint', sub.endpoint);
          
      } catch (err: any) {
        console.error('Failed to send push to endpoint:', sub.endpoint, err);
        failCount++;
        // If the subscription is no longer valid (e.g., user revoked permissions), delete it
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', sub.endpoint);
        }
      }
    });

    await Promise.allSettled(pushPromises);

    return NextResponse.json({
      success: true,
      message: `Notifications sent. Success: ${successCount}, Failed: ${failCount}`,
    });
  } catch (error) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
