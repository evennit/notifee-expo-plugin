/** IOS */
export const DEFAULT_IOS_BUILD_NUMBER = "1";
export const DEFAULT_APP_VERSION = "1.0.0";
export const DEFAULT_IOS_DEPLOYMENT_TARGET = "13.4";
export const PACKAGE_NAME = "@evennit/notifee-expo-plugin";

export const EXTENSION_SERVICE_NAME = "NotifeeNotificationServiceExtension";
export const EXTENSION_SERVICE_FILE = "NotificationService.m";
export const FILES_TO_ADD = [
  `NotifeeNotificationServiceExtension-Info.plist`,
  `NotifeeNotificationServiceExtension.entitlements`,
  "NotificationService.h",
];

export const PODFILE_MODIF_NEEDED = `
podSpec = File.join(File.dirname(\`node --print "require.resolve('@notifee/react-native/package.json')"\`), "RNNotifeeCore.podspec")
$NotifeeExtension = true
target 'NotifeeNotificationServiceExtension' do
  pod 'RNNotifeeCore', :path => podSpec
  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
end`;
export const PODFILE_TARGET_STRING = "target 'NotifeeNotificationServiceExtension'";
export const APP_VERSION_STRING = "[IF_YOU_SEE_THIS_YOU_FORGOT_TO_ADD_APP_VERSION_IN_EXPO_CONFIG]";
export const BUNDLE_IDENTIFIER_STRING = "[IF_YOU_SEE_THIS_YOU_FORGOT_TO_ADD_BUNDLE_IDENTIFIER_IN_IOS_EXPO_CONFIG]";
export const IOS_BUILD_NUMBER_STRING = "[IF_YOU_SEE_THIS_YOU_FORGOT_TO_ADD_BUILD_NUMBER_IN_IOS_EXPO_CONFIG]";

export const BACKGROUND_MODES_TO_ENABLE = ["remote-notification"];
export const USER_ACTIVITY_TYPES_KEYS = ["INSendMessageIntent"];

/** ANDROID */

export const RES_PATH = "android/app/src/main/res/";

export const SMALL_ICONS_SIZES = [
  {
    name: "drawable-mdpi",
    size: 24,
  },
  {
    name: "drawable-hdpi",
    size: 36,
  },
  {
    name: "drawable-xhdpi",
    size: 48,
  },
  {
    name: "drawable-xxhdpi",
    size: 72,
  },
  {
    name: "drawable-xxxhdpi",
    size: 96,
  },
];
export const LARGE_ICONS_SIZES = [
  {
    name: "drawable-xxxhdpi",
    size: 256,
  },
];
