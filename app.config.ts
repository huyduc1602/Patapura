import { ExpoConfig, ConfigContext } from '@expo/config';
import { withBuildProperties } from 'expo-build-properties';

export default ({ config }: ConfigContext): ExpoConfig => {
  return withBuildProperties({
    name: 'パタプラ',
    description: 'パタプライングリッシュの会員向けアプリ',
    slug: 'patapura',
    scheme: 'patapura',
    owner: 'patapura',
    version: '1.0.9',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    jsEngine: "jsc",
    plugins: [
      '@react-native-firebase/app',
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      ['./plugins/withFixedDeploymentTarget.js'],
      ['./plugins/withDisableForcedDarkModeAndroid.js', {}]
    ],
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    runtimeVersion: {
      "policy": "sdkVersion"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/bd59ac4b-7f51-46f3-bec1-74a382e1b493"
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.patapura.app',
      buildNumber: '57',
      userInterfaceStyle: 'light',
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        NSSpeechRecognitionUsageDescription: '音声からテキストの書き起こしのためにスピーチ機能を使用します',
        CFBundleDevelopmentRegion: 'ja_JP',
        UIBackgroundModes: ['audio'],
      },
    },
    android: {
      versionCode: 34,
      userInterfaceStyle: 'light',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.patapura.app',
      permissions: [
        'FOREGROUND_SERVICE',
        'RECORD_AUDIO',
        'INTERNET',
        'SYSTEM_ALERT_WINDOW',
        'com.google.android.gms.permission.AD_ID'
      ],
      googleServicesFile: './google-services.json',
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'patapura',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      BASE_API_URL: 'https://patapura.com',
      TOKEN_SECRET:
        '1CnMd0QUvSVqPXvImDlSEIkqKNOlpNePIF6kAQjOFXTwSorATra2l346r6N8Fcp5Ldfoy760EJttH8leIYXQHLf5pa0hPP9Gmys1AyV87IYkzx4Y2ZcGhojhXPVZmtpWSQ_kjH_NkIXm0bgvb_9HucfBylzvQV4HixRVju4v0LpYC6ibnor2_3CpmshG4ifrbXGzlGKisiKhyoU7hZ7ldLnD15XdLi43cfcIQDbV0zAMG39nC0oWnkoPLWTcIzJO',
      DEBUG_USER_EMAIL: process.env.DEBUG_USER_EMAIL || '',
      DEBUG_USER_PASSWORD: process.env.DEBUG_USER_PASSWORD || '',
      DEBUG_MODE: true,
      eas: {
        projectId: 'bd59ac4b-7f51-46f3-bec1-74a382e1b493'
      }
    }
  }, {
    ios: {
      deploymentTarget: '13.0'
    },
    android: {
      compileSdkVersion: 33,
      targetSdkVersion: 33,
      buildToolsVersion: "33.0.0",
      enableProguardInReleaseBuilds: true
    }
  });
};
