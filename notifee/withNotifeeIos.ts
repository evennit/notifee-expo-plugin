/**
 * Expo config plugin for Notifee (iOS)
 * @see https://documentation.notifee.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps
 */

import {
  ConfigPlugin,
  withEntitlementsPlist,
  withInfoPlist,
  withXcodeProject,
  withDangerousMod,
} from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";
import {
  DEFAULT_BUNDLE_SHORT_VERSION,
  DEFAULT_BUNDLE_VERSION,
  IPHONEOS_DEPLOYMENT_TARGET,
  NSE_TARGET_NAME,
  NSE_SOURCE_FILE,
  NSE_EXT_FILES,
  TARGETED_DEVICE_FAMILY,
} from "../support/iosConstants";
import { updatePodfile } from "../support/updatePodfile";
import NseUpdaterManager from "../support/NseUpdaterManager";
import { NotifeeLog } from "../support/NotifeeLog";
import { FileManager } from "../support/FileManager";
import { NotifeePluginProps } from "../types/types";
import assert from "assert";
import getEasManagedCredentialsConfigExtra from "../support/eas/getEasManagedCredentialsConfigExtra";
import { ExpoConfig } from "@expo/config-types";

/**
 * Add 'aps-environment' record with current environment to '<project-name>.entitlements' file
 * @see https://documentation.notifee.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps
 */
const withAppEnvironment: ConfigPlugin<NotifeePluginProps> = (
  config,
  notifeeProps
) => {
  return withEntitlementsPlist(config, (newConfig) => {
    if (notifeeProps?.mode == null) {
      throw new Error(`
        Missing required "mode" key in your app.json or app.config.js file for "notifee-expo-plugin".
        "mode" can be either "development" or "production".
        Please see notifee-expo-plugin's README.md for more details.`);
    }

    //Turns Communication Notifications on
    if (notifeeProps?.enableCommunicationNotifications) {
      newConfig.modResults[
        "com.apple.developer.usernotifications.communication"
      ] = true;
    }

    newConfig.modResults["aps-environment"] = notifeeProps.mode;

    return newConfig;
  });
};

/**
 * Add "Background Modes -> Remote notifications" and "App Group" permissions
 * @see https://documentation.notifee.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps
 */
const withRemoteNotificationsPermissions: ConfigPlugin<NotifeePluginProps> = (
  config
) => {
  const BACKGROUND_MODE_KEYS = ["processing", "remote-notification"];
  return withInfoPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults.UIBackgroundModes)) {
      newConfig.modResults.UIBackgroundModes = [];
    }
    for (const key of BACKGROUND_MODE_KEYS) {
      if (!newConfig.modResults.UIBackgroundModes.includes(key)) {
        newConfig.modResults.UIBackgroundModes.push(key);
      }
    }
    const USER_ACTIVITY_TYPES_KEYS = ["INSendMessageIntent"];
    if (!Array.isArray(newConfig.modResults.NSUserActivityTypes)) {
      newConfig.modResults.NSUserActivityTypes = [];
    }
    for (const key of USER_ACTIVITY_TYPES_KEYS) {
      if (!newConfig.modResults.NSUserActivityTypes.includes(key)) {
        newConfig.modResults.NSUserActivityTypes.push(key);
      }
    }

    return newConfig;
  });
};

/**
 * Add "App Group" permission
 * @see https://documentation.notifee.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps (step 4.4)
 */
const withAppGroupPermissions: ConfigPlugin<NotifeePluginProps> = (config) => {
  const APP_GROUP_KEY = "com.apple.security.application-groups";
  return withEntitlementsPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults[APP_GROUP_KEY])) {
      newConfig.modResults[APP_GROUP_KEY] = [];
    }
    const modResultsArray = newConfig.modResults[APP_GROUP_KEY] as Array<any>;
    const entitlement = `group.${
      newConfig?.ios?.bundleIdentifier || ""
    }.notifee`;
    if (modResultsArray.indexOf(entitlement) !== -1) {
      return newConfig;
    }
    modResultsArray.push(entitlement);

    return newConfig;
  });
};

const withEasManagedCredentials: ConfigPlugin<NotifeePluginProps> = (
  config
) => {
  assert(
    config.ios?.bundleIdentifier,
    "Missing 'ios.bundleIdentifier' in app config."
  );
  config.extra = getEasManagedCredentialsConfigExtra(config as ExpoConfig);
  return config;
};

const withNotifeePodfile: ConfigPlugin<NotifeePluginProps> = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      // not awaiting in order to not block main thread
      const iosRoot = path.join(config.modRequest.projectRoot, "ios");
      updatePodfile(iosRoot).catch((err) => {
        NotifeeLog.error(err);
      });

      return config;
    },
  ]);
};

const withNotifeeNSE: ConfigPlugin<NotifeePluginProps> = (config, props) => {
  // support for monorepos where node_modules can be above the project directory.
  const pluginDir = require.resolve(
    "@evennit/notifee-expo-plugin/package.json"
  );
  const sourceDir = path.join(
    pluginDir,
    "../build/support/serviceExtensionFiles/"
  );

  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const iosPath = path.join(config.modRequest.projectRoot, "ios");

      /* COPY OVER EXTENSION FILES */
      fs.mkdirSync(`${iosPath}/${NSE_TARGET_NAME}`, { recursive: true });

      for (let i = 0; i < NSE_EXT_FILES.length; i++) {
        const extFile = NSE_EXT_FILES[i];
        const targetFile = `${iosPath}/${NSE_TARGET_NAME}/${extFile}`;
        await FileManager.copyFile(`${sourceDir}${extFile}`, targetFile);
      }

      // Copy NSE source file either from configuration-provided location, falling back to the default one.
      const sourcePath =
        props.iosNSEFilePath ?? `${sourceDir}${NSE_SOURCE_FILE}`;
      const targetFile = `${iosPath}/${NSE_TARGET_NAME}/${NSE_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePath}`, targetFile);

      /* MODIFY COPIED EXTENSION FILES */
      const nseUpdater = new NseUpdaterManager(iosPath);
      await nseUpdater.updateNSEEntitlements(
        `group.${config.ios?.bundleIdentifier}.notifee`
      );
      await nseUpdater.updateNSEBundleVersion(
        config.ios?.buildNumber ?? DEFAULT_BUNDLE_VERSION
      );
      await nseUpdater.updateNSEBundleShortVersion(
        config?.version ?? DEFAULT_BUNDLE_SHORT_VERSION
      );

      return config;
    },
  ]);
};

const withNotifeeXcodeProject: ConfigPlugin<NotifeePluginProps> = (
  config,
  props
) => {
  return withXcodeProject(config, (newConfig) => {
    const xcodeProject = newConfig.modResults;

    if (!!xcodeProject.pbxTargetByName(NSE_TARGET_NAME)) {
      NotifeeLog.log(
        `${NSE_TARGET_NAME} already exists in project. Skipping...`
      );
      return newConfig;
    }

    // Create new PBXGroup for the extension
    const extGroup = xcodeProject.addPbxGroup(
      [...NSE_EXT_FILES, NSE_SOURCE_FILE],
      NSE_TARGET_NAME,
      NSE_TARGET_NAME
    );

    // Add the new PBXGroup to the top level group. This makes the
    // files / folder appear in the file explorer in Xcode.
    const groups = xcodeProject.hash.project.objects["PBXGroup"];
    Object.keys(groups).forEach(function (key) {
      if (
        typeof groups[key] === "object" &&
        groups[key].name === undefined &&
        groups[key].path === undefined
      ) {
        xcodeProject.addToPbxGroup(extGroup.uuid, key);
      }
    });

    // WORK AROUND for codeProject.addTarget BUG
    // Xcode projects don't contain these if there is only one target
    // An upstream fix should be made to the code referenced in this link:
    //   - https://github.com/apache/cordova-node-xcode/blob/8b98cabc5978359db88dc9ff2d4c015cba40f150/lib/pbxProject.js#L860
    const projObjects = xcodeProject.hash.project.objects;
    projObjects["PBXTargetDependency"] =
      projObjects["PBXTargetDependency"] || {};
    projObjects["PBXContainerItemProxy"] =
      projObjects["PBXTargetDependency"] || {};

    // Add the NSE target
    // This adds PBXTargetDependency and PBXContainerItemProxy for you
    const nseTarget = xcodeProject.addTarget(
      NSE_TARGET_NAME,
      "app_extension",
      NSE_TARGET_NAME,
      `${config.ios?.bundleIdentifier}.${NSE_TARGET_NAME}`
    );

    // Add build phases to the new target
    xcodeProject.addBuildPhase(
      ["NotificationService.m"],
      "PBXSourcesBuildPhase",
      "Sources",
      nseTarget.uuid
    );
    xcodeProject.addBuildPhase(
      [],
      "PBXResourcesBuildPhase",
      "Resources",
      nseTarget.uuid
    );

    xcodeProject.addBuildPhase(
      [],
      "PBXFrameworksBuildPhase",
      "Frameworks",
      nseTarget.uuid
    );

    // Edit the Deployment info of the new Target, only IphoneOS and Targeted Device Family
    // However, can be more
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      if (
        typeof configurations[key].buildSettings !== "undefined" &&
        configurations[key].buildSettings.PRODUCT_NAME == `"${NSE_TARGET_NAME}"`
      ) {
        const buildSettingsObj = configurations[key].buildSettings;
        buildSettingsObj.DEVELOPMENT_TEAM = props?.devTeam;
        buildSettingsObj.IPHONEOS_DEPLOYMENT_TARGET =
          props?.iPhoneDeploymentTarget ?? IPHONEOS_DEPLOYMENT_TARGET;
        buildSettingsObj.TARGETED_DEVICE_FAMILY = TARGETED_DEVICE_FAMILY;
        buildSettingsObj.CODE_SIGN_ENTITLEMENTS = `${NSE_TARGET_NAME}/${NSE_TARGET_NAME}.entitlements`;
        buildSettingsObj.CODE_SIGN_STYLE = "Automatic";
      }
    }

    // Add development teams to both your target and the original project
    xcodeProject.addTargetAttribute(
      "DevelopmentTeam",
      props?.devTeam,
      nseTarget
    );
    xcodeProject.addTargetAttribute("DevelopmentTeam", props?.devTeam);
    return newConfig;
  });
};

export const withNotifeeIos: ConfigPlugin<NotifeePluginProps> = (
  config,
  props
) => {
  config = withAppEnvironment(config, props);
  config = withRemoteNotificationsPermissions(config, props);
  config = withAppGroupPermissions(config, props);
  config = withNotifeePodfile(config, props);
  config = withNotifeeNSE(config, props);
  config = withNotifeeXcodeProject(config, props);
  config = withEasManagedCredentials(config, props);

  return config;
};
