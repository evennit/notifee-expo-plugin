/**
 * Expo config plugin for One Signal
 * @see https://documentation.onesignal.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps
 */

import { ConfigPlugin } from "@expo/config-plugins";
import { NotifeePluginProps } from "../types/types";
import { withNotifeeAndroid } from "./withNotifeeAndroid";
import { withNotifeeIos } from "./withNotifeeIos";
import { validatePluginProps } from "../support/helpers";

const withNotifee: ConfigPlugin<NotifeePluginProps> = (config, props) => {
  // if props are undefined, throw error
  if (!props) {
    throw new Error(
      'You are trying to use the Notifee plugin without any props. Property "mode" is required. Please see https://github.com/Notifee/notifee-expo-plugin for more info.',
    );
  }

  validatePluginProps(props);

  config = withNotifeeIos(config, props);
  config = withNotifeeAndroid(config, props);

  return config;
};

export default withNotifee;
