import { NOTIFEE_PLUGIN_PROPS } from "../types/types";

export function validatePluginProps(props: any): void {
  // check the type of each property
  if (typeof props.mode !== "string") {
    throw new Error("Notifee Expo Plugin: 'mode' must be a string.");
  }

  if (props.devTeam && typeof props.devTeam !== "string") {
    throw new Error("Notifee Expo Plugin: 'devTeam' must be a string.");
  }

  if (props.iPhoneDeploymentTarget && typeof props.iPhoneDeploymentTarget !== "string") {
    throw new Error("Notifee Expo Plugin: 'iPhoneDeploymentTarget' must be a string.");
  }

  if (props.smallIcons && !Array.isArray(props.smallIcons)) {
    throw new Error("Notifee Expo Plugin: 'smallIcons' must be an array.");
  }

  if (props.smallIconAccentColor && typeof props.smallIconAccentColor !== "string") {
    throw new Error("Notifee Expo Plugin: 'smallIconAccentColor' must be a string.");
  }

  if (props.largeIcons && !Array.isArray(props.largeIcons)) {
    throw new Error("Notifee Expo Plugin: 'largeIcons' must be an array.");
  }

  if (props.iosNSEFilePath && typeof props.iosNSEFilePath !== "string") {
    throw new Error("Notifee Expo Plugin: 'iosNSEFilePath' must be a string.");
  }

  // check for extra properties
  const inputProps = Object.keys(props);

  for (const prop of inputProps) {
    if (!NOTIFEE_PLUGIN_PROPS.includes(prop)) {
      throw new Error(`Notifee Expo Plugin: You have provided an invalid property "${prop}" to the Notifee plugin.`);
    }
  }
}
