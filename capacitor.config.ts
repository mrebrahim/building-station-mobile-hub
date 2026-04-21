import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.buildingstation.app',
  appName: 'Building Station',
  webDir: 'dist',

  // ✅ Production: يستخدم الـ dist build المحلي (offline-ready)
  // ✅ للـ App Store: نشيل الـ server url عشان Apple تقبل
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#ffffff',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    contentInset: 'automatic',
    allowsInlineMediaPlayback: true,
    preferredContentMode: 'mobile',
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    disallowOverscroll: true,
    // ✅ مهم جداً لـ Apple - بيخلي الـ app يشتغل offline
    webContentsDebuggingEnabled: false,
    allowsBackForwardNavigationGestures: false,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
    webContentsDebuggingEnabled: false,
    captureInput: true,
  },
};

export default config;
