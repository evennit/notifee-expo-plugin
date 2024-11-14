"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const config_1 = require("./config");
const image_utils_1 = require("@expo/image-utils");
const path_1 = require("path");
/**
 * Adds Notifee icons to the appropriate Android resource folders.
 *
 * @param config - The Expo configuration object.
 * @param props - The properties required for configuring Notifee-Expo-Plugin.
 *
 * @returns The updated Expo configuration object.
 */
const addIconsToFolders = (config, props) => {
    if (!props.androidIcons && !config.notification?.icon)
        return config;
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            const rootPath = config.modRequest.projectRoot;
            if (props.androidIcons)
                for (const icon of props.androidIcons)
                    await saveIcon(icon, rootPath);
            //If an icon was mentioned in expo config
            if (config.notification && config.notification.icon)
                await saveIcon({
                    name: path.parse(config.notification.icon).name,
                    path: config.notification.icon,
                    type: "small",
                }, rootPath);
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
const addSoundsToFolder = (config, props) => {
    if (!props.sounds || props.sounds.length === 0)
        return config;
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            const rootPath = config.modRequest.projectRoot;
            if (!Array.isArray(props.sounds)) {
                throw new Error(`An error occurred while configuring Android notifications. Must provide an array of sound files in your app config, found ${typeof props.sounds}.`);
            }
            for (const soundFileRelativePath of props.sounds) {
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
const saveSound = async (soundFileRelativePath, rootPath) => {
    const rawResourcesPath = (0, path_1.resolve)(rootPath, config_1.RES_PATH, "raw");
    const inputFilename = (0, path_1.basename)(soundFileRelativePath);
    if (inputFilename) {
        try {
            const sourceFilepath = (0, path_1.resolve)(rootPath, soundFileRelativePath);
            const destinationFilepath = (0, path_1.resolve)(rawResourcesPath, inputFilename);
            createFoldersIfNotExist(rawResourcesPath);
            (0, fs_1.copyFileSync)(sourceFilepath, destinationFilepath);
        }
        catch (e) {
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
const saveIcon = async (icon, rootPath) => {
    const folders = icon.type === "large" ? config_1.LARGE_ICONS_SIZES : config_1.SMALL_ICONS_SIZES;
    for (const folder of folders) {
        const folderPath = path.resolve(rootPath, config_1.RES_PATH, folder.name);
        createFoldersIfNotExist(folderPath);
        const processedIcon = await resizeImgUsingExpoImageUtils(icon, rootPath, folder.size);
        (0, fs_1.writeFileSync)(path.resolve(folderPath, icon.name + ".png"), processedIcon);
    }
};
/**
 * Creates the specified folders if they do not already exist.
 *
 * @param p - The path of the folder to create.
 */
const createFoldersIfNotExist = (p) => {
    if (!(0, fs_1.existsSync)(p))
        (0, fs_1.mkdirSync)(p, { recursive: true });
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
const resizeImgUsingExpoImageUtils = async (icon, rootPath, size) => {
    return (await (0, image_utils_1.generateImageAsync)({ projectRoot: rootPath, cacheType: "notifee-icon" }, {
        src: icon.path,
        width: size,
        height: size,
        backgroundColor: "transparent",
        resizeMode: "cover",
    })).source;
};
exports.default = {
    addIconsToFolders,
    addSoundsToFolder,
};
