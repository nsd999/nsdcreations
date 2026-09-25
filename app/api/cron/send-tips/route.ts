import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import webpush from 'web-push';
import { tipsData } from '@/lib/tips-data';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 503 });
    }

    webpush.setVapidDetails(
      'mailto:nsd.creations.official@gmail.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const supabase = getSupabaseAdmin();
    const nowIso = new Date().toISOString();

    // Publish due CMS tips.
    await supabase
      .from("cms_tips")
      .update({
        status: "published",
        published_at: nowIso,
        updated_at: nowIso,
      })
      .eq("status", "draft")
      .lte("scheduled_for", nowIso);

    // Deliver scheduled notification campaigns that are due.
    const { data: scheduledCampaigns } = await supabase
      .from("notification_campaigns")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_for", nowIso)
      .order("scheduled_for", { ascending: true })
      .limit(20);

    for (const campaign of scheduledCampaigns || []) {
      let scheduledQuery = supabase
        .from("push_subscriptions")
        .select("id,endpoint,p256dh,auth,status")
        .eq("status", "active");

      if (campaign.audience === "selected" && Array.isArray(campaign.recipient_ids)) {
        scheduledQuery = scheduledQuery.in("id", campaign.recipient_ids);
      }

      const { data: campaignSubscribers } = await scheduledQuery;
      let campaignSent = 0;
      let campaignFailed = 0;

      for (const sub of campaignSubscribers || []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify({
              title: campaign.title,
              body: campaign.body,
              icon: "/icon.png",
              url: campaign.url?.startsWith("/") ? campaign.url : "/",
              type: campaign.notification_type,
            }),
          );

          campaignSent += 1;
          await supabase.from("push_subscriptions").update({
            last_notification_status: "sent",
            last_notification_at: nowIso,
            failure_count: 0,
          }).eq("id", sub.id);
        } catch (error: any) {
          campaignFailed += 1;
          const invalid = error?.statusCode === 404 || error?.statusCode === 410;
          await supabase.from("push_subscriptions").update({
            status: invalid ? "inactive" : "active",
            last_notification_status: invalid ? "expired" : "failed",
            last_notification_at: nowIso,
            failure_count: 1,
          }).eq("id", sub.id);
        }
      }

      await supabase.from("notification_campaigns").update({
        status: "sent",
        recipients_count: (campaignSubscribers || []).length,
        sent_count: campaignSent,
        failed_count: campaignFailed,
        sent_at: nowIso,
      }).eq("id", campaign.id);
    }

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
          .update({ last_tip_id: Number(tip.id) || randomTipIndex })
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
