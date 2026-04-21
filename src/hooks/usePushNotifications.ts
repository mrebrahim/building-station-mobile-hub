import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from 'sonner';

export const usePushNotifications = () => {
  useEffect(() => {
    // ✅ شغّال بس على iOS/Android - مش على Web
    if (!Capacitor.isNativePlatform()) return;

    const setup = async () => {
      // طلب الإذن
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') return;

      // تسجيل
      await PushNotifications.register();

      // استقبال الـ token
      PushNotifications.addListener('registration', (token) => {
        console.log('Push token:', token.value);
        // هنا ممكن ترسل الـ token لـ Supabase أو WooCommerce
        localStorage.setItem('push_token', token.value);
      });

      // استقبال الإشعار وهو شغّال
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        toast(notification.title || 'إشعار جديد', {
          description: notification.body,
        });
      });

      // لما يضغط على الإشعار
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const data = action.notification.data;
        if (data?.url) window.location.href = data.url;
      });
    };

    setup().catch(console.error);

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);
};
