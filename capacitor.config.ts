
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.335b05e6dba54ec89f216072ed19a820',
  appName: 'building-station-mobile-hub',
  webDir: 'dist',
  server: {
    url: 'https://335b05e6-dba5-4ec8-9f21-6072ed19a820.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
  ios: {
    webContentsDebuggingEnabled: false,
    allowsInlineMediaPlayback: true,
    suppressesIncrementalRendering: false,
    handleApplicationURL: false,
    scheme: "app",
    preferredContentMode: "mobile",
    scrollEnabled: true,
    zoom: false,
    allowsBackForwardNavigationGestures: false,
    allowsLinkPreview: false,
    overrideUserAgent: null,
    backgroundColor: "#ffffff",
    disallowOverscroll: true
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: null,
    overrideUserAgent: null,
    backgroundColor: "#ffffff",
    loggingBehavior: "none",
    handleApplicationURL: false
  }
};

export default config;
