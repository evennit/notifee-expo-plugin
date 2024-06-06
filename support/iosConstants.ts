export const IPHONEOS_DEPLOYMENT_TARGET = "13.4";
export const TARGETED_DEVICE_FAMILY = `"1,2"`;

export const NSE_PODFILE_SNIPPET = `
$NotifeeExtension = true
target 'NotifeeNotificationServiceExtension' do
  pod 'RNNotifeeCore', :path => '../node_modules/@notifee/react-native/RNNotifeeCore.podspec'
  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
end`;

export const NSE_PODFILE_REGEX = /target 'NotifeeNotificationServiceExtension'/;

export const GROUP_IDENTIFIER_TEMPLATE_REGEX = /{{GROUP_IDENTIFIER}}/gm;
export const BUNDLE_SHORT_VERSION_TEMPLATE_REGEX = /{{BUNDLE_SHORT_VERSION}}/gm;
export const BUNDLE_VERSION_TEMPLATE_REGEX = /{{BUNDLE_VERSION}}/gm;

export const DEFAULT_BUNDLE_VERSION = '1';
export const DEFAULT_BUNDLE_SHORT_VERSION = '1.0';

export const NSE_TARGET_NAME = "NotifeeNotificationServiceExtension";
export const NSE_SOURCE_FILE = "NotificationService.m";
export const NSE_EXT_FILES = ["NotificationService.h", `${NSE_TARGET_NAME}.entitlements`, `${NSE_TARGET_NAME}-Info.plist`];
