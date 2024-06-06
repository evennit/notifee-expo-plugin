/**
 * Expo config plugin for Notifee (Android)
 * @see https://documentation.onesignal.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps
 */

import { ConfigPlugin, withDangerousMod, withStringsXml } from "@expo/config-plugins";
import { generateImageAsync } from "@expo/image-utils";
import { NotifeeLog } from "../support/NotifeeLog";
import { NotifeePluginProps } from "../types/types";
import { resolve, parse } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const RESOURCE_ROOT_PATH = "android/app/src/main/res/";

// The name of each small icon folder resource, and the icon size for that folder.
const SMALL_ICON_DIRS_TO_SIZE: { [name: string]: number } = {
  "drawable-mdpi": 24,
  "drawable-hdpi": 36,
  "drawable-xhdpi": 48,
  "drawable-xxhdpi": 72,
  "drawable-xxxhdpi": 96,
};

// The name of each large icon folder resource, and the icon size for that folder.
const LARGE_ICON_DIRS_TO_SIZE: { [name: string]: number } = {
  "drawable-xxxhdpi": 256,
};

const withSmallIcons: ConfigPlugin<NotifeePluginProps> = (config, notifeeProps) => {
  if (!notifeeProps.smallIcons && !config.notification?.icon) {
    return config;
  }

  // we are modifying the android build (adding files) without a base mod
  return withDangerousMod(config, [
    "android",
    async (config) => {
      if (config.notification?.icon) {
        await saveIconAsync(config.notification.icon, config.modRequest.projectRoot, SMALL_ICON_DIRS_TO_SIZE);
      }

      if (notifeeProps.smallIcons) {
        await saveIconsArrayAsync(config.modRequest.projectRoot, notifeeProps.smallIcons, SMALL_ICON_DIRS_TO_SIZE);
      }
      return config;
    },
  ]);
};

const withLargeIcons: ConfigPlugin<NotifeePluginProps> = (config, notifeeProps) => {
  if (!notifeeProps.largeIcons) {
    return config;
  }

  // we are modifying the android build (adding files) without a base mod
  return withDangerousMod(config, [
    "android",
    async (config) => {
      if (notifeeProps.largeIcons) {
        await saveIconsArrayAsync(config.modRequest.projectRoot, notifeeProps.largeIcons, LARGE_ICON_DIRS_TO_SIZE);
      }
      return config;
    },
  ]);
};

const withSmallIconAccentColor: ConfigPlugin<NotifeePluginProps> = (config, notifeeProps) => {
  if (!notifeeProps.smallIconAccentColor) {
    return config;
  }

  return withStringsXml(config, (config) => {
    const colorInARGB = `FF${notifeeProps.smallIconAccentColor?.replace("#", "")}`;
    const strings = config.modResults.resources.string ?? [];

    // Check if the accent color entry already exists
    const hasAccentColor = strings.some(
      (stringEntry) => stringEntry.$?.name === "notifee_notification_accent_color" && stringEntry._ === colorInARGB,
    );

    if (!hasAccentColor) {
      const accentColorEntry = {
        $: { name: "notifee_notification_accent_color" },
        _: colorInARGB,
      };

      config.modResults.resources.string = [...strings, accentColorEntry];
    }

    return config;
  });
};

async function saveIconsArrayAsync(projectRoot: string, icons: string[], dirsToSize: { [name: string]: number }) {
  for (const icon of icons) {
    await saveIconAsync(icon, projectRoot, dirsToSize);
  }
}

async function saveIconAsync(icon: string, projectRoot: string, dirsToSize: { [name: string]: number }) {
  const name = parse(icon).name;

  NotifeeLog.log("Saving icon " + icon + " as drawable resource " + name);

  for (const iconResourceDir in dirsToSize) {
    const path = resolve(projectRoot, RESOURCE_ROOT_PATH, iconResourceDir);

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    const resizedIcon = (
      await generateImageAsync(
        { projectRoot, cacheType: "notifee-icon" },
        {
          src: icon,
          width: dirsToSize[iconResourceDir],
          height: dirsToSize[iconResourceDir],
          resizeMode: "cover",
          backgroundColor: "transparent",
        },
      )
    ).source;

    writeFileSync(resolve(path, name + ".png"), resizedIcon);
  }
}

export const withNotifeeAndroid: ConfigPlugin<NotifeePluginProps> = (config, props) => {
  config = withSmallIcons(config, props);
  config = withLargeIcons(config, props);
  config = withSmallIconAccentColor(config, props);
  return config;
};
