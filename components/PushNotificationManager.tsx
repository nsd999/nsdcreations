"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if push is supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    // Register SW
    navigator.serviceWorker.register('/sw.js').catch(err => console.error("SW registration failed", err));

    // Listen for push events broadcasted by SW for custom audio
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_RECEIVED') {
        const type = event.data.payload?.type;
        if (type === 'review') {
          playNSDReviewNotification();
        } else {
          playNSDTipNotification();
        }
      }
    };
    navigator.serviceWorker.addEventListener('message', handleSWMessage);

    const checkSubscription = async () => {
      if (Notification.permission === 'granted') {
        // If they already allowed it (e.g. from Chrome settings), make sure they are actually subscribed to the PushManager!
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (!subscription) {
            // They allowed it but aren't subscribed yet, so subscribe them silently
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (vapidPublicKey) {
              const newSub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
              });
              await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSub),
              });
            }
          }
          setIsSubscribed(true);
        } catch (error) {
          console.error('Error during silent subscription check:', error);
        }
      } else if (Notification.permission === 'default') {
        // Show our custom prompt immediately so they don't miss it
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      }
    };

    checkSubscription();

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    };
  }, []);

  function playNSDTipNotification() {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.4); // A5 note
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 2.5);
  }

  function playNSDReviewNotification() {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Helper function to play a single pleasant tone (bell-like chime)
    function playTone(freq: number, startTime: number, duration: number) {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Smooth attack and release
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    }
    
    const now = audioCtx.currentTime;
    playTone(523.25, now, 1.5);       // C5
    playTone(659.25, now + 0.15, 1.5); // E5
    playTone(783.99, now + 0.3, 2.0);  // G5 (lingers slightly longer)
  }

  const handleSubscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        
        if (!vapidPublicKey) {
          console.error("VAPID public key not found in env");
          return;
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        // Send to backend
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });

        setIsSubscribed(true);
        setShowPrompt(false);
        localStorage.setItem('hasSeenPushPrompt', 'true');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // As requested, make the prompt reappear every 10 seconds if dismissed
    setTimeout(() => {
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }, 10000);
  };

  if (isSubscribed) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 w-[380px] p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl"
        >
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl relative overflow-hidden h-full w-full">
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Unlock 50 Growth Tips</h3>
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Allow notifications to receive updates on our latest projects, insights, and exclusive content directly from our team.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleSubscribe}
                className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 group"
              >
                <span>Enable Notifications</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
