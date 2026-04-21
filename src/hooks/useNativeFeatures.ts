import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SplashScreen } from '@capacitor/splash-screen';

export const useNativeFeatures = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setup = async () => {
      // ✅ Status Bar
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });

      // ✅ إخفاء Splash Screen بعد التحميل
      await SplashScreen.hide({ fadeOutDuration: 500 });
    };

    setup().catch(console.error);
  }, []);
};

// ✅ Haptic feedback للأزرار
export const hapticFeedback = async (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if (!Capacitor.isNativePlatform()) return;
  const styleMap = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  };
  await Haptics.impact({ style: styleMap[style] }).catch(() => {});
};
