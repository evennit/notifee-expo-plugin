import { NotifeeAndroidIcon, NotifeeExpoPluginProps } from "./types";
import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import * as path from "path";
import { LARGE_ICONS_SIZES, RES_PATH, SMALL_ICONS_SIZES } from "./config";
import { generateImageAsync } from "@expo/image-utils";
import { basename, resolve } from "path";

/**
 * Adds Notifee icons to the appropriate Android resource folders.
 *
 * @param config - The Expo configuration object.
 * @param props - The properties required for configuring Notifee-Expo-Plugin.
 *
 * @returns The updated Expo configuration object.
 */
const addIconsToFolders: ConfigPlugin<NotifeeExpoPluginProps> = (config, props) => {
  if (!props.androidIcons && !config.notification?.icon) return config;

  return withDangerousMod(config, [
    "android",
    async (config) => {
      const rootPath = config.modRequest.projectRoot;
      if (props.androidIcons) for (const icon of props.androidIcons) await saveIcon(icon, rootPath);

      //If an icon was mentioned in expo config
      if (config.notification && config.notification.icon)
        await saveIcon(
          {
            name: path.parse(config.notification.icon).name,
            path: config.notification.icon,
            type: "small",
          } as NotifeeAndroidIcon,
          rootPath,
        );

      return config;
    },
  ]);
};

/**
 * Adds Notifee icons to the appropriate Android resource folders.
 *
 * @param config - The Expo configuration object.
 * @param props - The properties required for configuring Notifee-Expo-Plugin.
 *
 * @returns The updated Expo configuration object.
 */
const addSoundsToFolder: ConfigPlugin<NotifeeExpoPluginProps> = (config, props) => {
  if (!props.androidSounds || props.androidSounds.length === 0) return config;

  return withDangerousMod(config, [
    "android",
    async (config) => {
      const rootPath = config.modRequest.projectRoot;
      if (!Array.isArray(props.androidSounds)) {
        throw new Error(
          `An error occurred while configuring Android notifications. Must provide an array of sound files in your app config, found ${typeof props.androidSounds}.`,
        );
      }
      for (const soundFileRelativePath of props.androidSounds) {
        saveSound(soundFileRelativePath, rootPath);
      }
      return config;
    },
  ]);
};

/**
 * Saves the provided icon to the appropriate Android resource folders.
 *
 * @param soundFileRelativePath - Relative path of the sound file you wish to add.
 * @param rootPath - The root path of the project.
 */
const saveSound = async (soundFileRelativePath: string, rootPath: string) => {
  const rawResourcesPath = resolve(rootPath, RES_PATH, "raw");
  const inputFilename = basename(soundFileRelativePath);

  if (inputFilename) {
    try {
      const sourceFilepath = resolve(rootPath, soundFileRelativePath);
      const destinationFilepath = resolve(rawResourcesPath, inputFilename);

      createFoldersIfNotExist(rawResourcesPath);
      copyFileSync(sourceFilepath, destinationFilepath);
    } catch (e) {
      throw new Error("An error occurred while configuring Android notifications. Encountered an issue copying Android notification sounds: " + e);
    }
  }
};

/**
 * Saves the provided icon to the appropriate Android resource folders.
 *
 * @param icon - The Notifee Android icon object.
 * @param rootPath - The root path of the project.
 */
const saveIcon = async (icon: NotifeeAndroidIcon, rootPath: string) => {
  const folders = icon.type === "large" ? LARGE_ICONS_SIZES : SMALL_ICONS_SIZES;

  for (const folder of folders) {
    const folderPath = path.resolve(rootPath, RES_PATH, folder.name);
    createFoldersIfNotExist(folderPath);

    const processedIcon = await resizeImgUsingExpoImageUtils(icon, rootPath, folder.size);
    writeFileSync(path.resolve(folderPath, icon.name + ".png"), processedIcon);
  }
};

/**
 * Creates the specified folders if they do not already exist.
 *
 * @param p - The path of the folder to create.
 */
const createFoldersIfNotExist = (p: string) => {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
};

/**
 * Resizes the provided image using Expo's image utility.
 *
 * @param icon - The Notifee Android icon object.
 * @param rootPath - The root path of the project.
 * @param size - The desired size of the image.
 *
 * @returns The processed image buffer.
 */
const resizeImgUsingExpoImageUtils = async (icon: NotifeeAndroidIcon, rootPath: string, size: number) => {
  return (
    await generateImageAsync(
      { projectRoot: rootPath, cacheType: "notifee-icon" },
      {
        src: icon.path,
        width: size,
        height: size,
        backgroundColor: "transparent",
        resizeMode: "cover",
      },
    )
  ).source;
};

export default {
  addIconsToFolders,
  addSoundsToFolder,
};
