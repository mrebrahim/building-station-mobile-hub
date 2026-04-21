import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from 'sonner';

const SUPABASE_URL = 'https://cyyeydswwbbqhehbhhbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eWV5ZHN3d2JicWhlaGJoaGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTMxODQsImV4cCI6MjA4OTI2OTE4NH0.6qt4-bYdMAmIdnWqJ1x4AWeYnj_DFO0Ugn34ROTnRwc';

const saveTokenToSupabase = async (token: string) => {
  try {
    const platform = Capacitor.getPlatform(); // 'ios' or 'android'
    await fetch(`${SUPABASE_URL}/functions/v1/save-push-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ token, platform }),
    });
    console.log('✅ Push token saved to Supabase');
  } catch (err) {
    console.error('Failed to save push token:', err);
  }
};

export const usePushNotifications = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setup = async () => {
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') return;

      await PushNotifications.register();

      // ✅ حفظ الـ token على Supabase
      PushNotifications.addListener('registration', (token) => {
        console.log('Push token:', token.value);
        localStorage.setItem('push_token', token.value);
        saveTokenToSupabase(token.value);
      });

      // ✅ إشعار وهو شغّال
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        toast(notification.title || 'إشعار جديد', {
          description: notification.body,
        });
      });

      // ✅ لما يضغط على الإشعار
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const data = action.notification.data;
        if (data?.url) window.location.href = data.url;
        if (data?.page) window.location.href = `/${data.page}`;
      });
    };

    setup().catch(console.error);
    return () => { PushNotifications.removeAllListeners(); };
  }, []);
};
