"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LARGE_ICONS_SIZES = exports.SMALL_ICONS_SIZES = exports.RES_PATH = exports.USER_ACTIVITY_TYPES_KEYS = exports.BACKGROUND_MODES_TO_ENABLE = exports.IOS_BUILD_NUMBER_STRING = exports.BUNDLE_IDENTIFIER_STRING = exports.APP_VERSION_STRING = exports.PODFILE_TARGET_STRING = exports.PODFILE_MODIF_NEEDED = exports.FILES_TO_ADD = exports.EXTENSION_SERVICE_FILE = exports.EXTENSION_SERVICE_NAME = exports.PACKAGE_NAME = exports.TARGET_DEVICES = exports.DEFAULT_IOS_DEPLOYMENT_TARGET = exports.DEFAULT_APP_VERSION = exports.DEFAULT_IOS_BUILD_NUMBER = void 0;
/** IOS */
exports.DEFAULT_IOS_BUILD_NUMBER = "1";
exports.DEFAULT_APP_VERSION = "1.0.0";
exports.DEFAULT_IOS_DEPLOYMENT_TARGET = "13.4";
exports.TARGET_DEVICES = '"1,2"'; // IPHONE / IPAD
exports.PACKAGE_NAME = "@evennit/notifee-expo-plugin";
exports.EXTENSION_SERVICE_NAME = "NotifeeNotificationServiceExtension";
exports.EXTENSION_SERVICE_FILE = "NotificationService.m";
exports.FILES_TO_ADD = [
    `NotifeeNotificationServiceExtension-Info.plist`,
    `NotifeeNotificationServiceExtension.entitlements`,
    "NotificationService.h",
];
exports.PODFILE_MODIF_NEEDED = `
$NotifeeExtension = true
target 'NotifeeNotificationServiceExtension' do
  pod 'RNNotifeeCore', :path => '../node_modules/@notifee/react-native/RNNotifeeCore.podspec'
  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
end`;
exports.PODFILE_TARGET_STRING = "target 'NotifeeNotificationServiceExtension'";
exports.APP_VERSION_STRING = "[IF_YOU_SEE_THIS_YOU_FORGOT_TO_ADD_APP_VERSION_IN_EXPO_CONFIG]";
exports.BUNDLE_IDENTIFIER_STRING = "[IF_YOU_SEE_THIS_YOU_FORGOT_TO_ADD_BUNDLE_IDENTIFIER_IN_IOS_EXPO_CONFIG]";
exports.IOS_BUILD_NUMBER_STRING = "[IF_YOU_SEE_THIS_YOU_FORGOT_TO_ADD_BUILD_NUMBER_IN_IOS_EXPO_CONFIG]";
exports.BACKGROUND_MODES_TO_ENABLE = ["remote-notification"];
exports.USER_ACTIVITY_TYPES_KEYS = ["INSendMessageIntent"];
/** ANDROID */
exports.RES_PATH = "android/app/src/main/res/";
exports.SMALL_ICONS_SIZES = [
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
exports.LARGE_ICONS_SIZES = [
    {
        name: "drawable-xxxhdpi",
        size: 256,
    },
];
