<h1>🔥👹 Notifee-Expo-Plugin 👹🔥</h1>

Are **YOU** looking for a plugin that will magically do these things for you without needing to eject your Expo app?:

- Add a notification service extension with the Notifee service _(Also useful because of low power mode on iOS disabling notifee onBackgroundEvent)_
- Automatically sign your main app and notification service extension targets with the apple dev team id you provided
- Add iOS communication notifications capability to your app
- Enable the iOS background modes of your liking
- Populate your android app's folders with your notification icon

Well... you are at the right place!

## 🧩 Install 🧩

Assure you already have `@notifee/react-native` installed and then:

```sh
# npm
npm install @evennit/notifee-expo-plugin

#or

# yarn
yarn add @evennit/notifee-expo-plugin
```

## 🛠️ Config 🛠️

Add the plugin to your Expo config's plugin array like so:

app.config.js

```js
{
  plugins: [
    [
      "@evennit/notifee-expo-plugin",
      {
        iosDeploymentTarget: "13.4", //<-- Must be the same as your main app target's iOS deployment target
        apsEnvMode: "development",
      },
    ],
  ];
}
```

app.config.json

```json
{
  "expo": {
    "plugins": [
      [
        "@evennit/notifee-expo-plugin",
        {
          "iosDeploymentTarget": "13.4", //<-- Must be the same as your main app target's iOS deployment target
          "apsEnvMode": "development"
        }
      ]
    ]
  }
}
```

## 🔨 Rebuild your app 🔨

After installing and adding the plugin to your project's Expo config plugin array, you need to rebuild your iOS and Android apps:

```sh
npx expo prebuild
```

Now you should be good to go!

## Props

| Property                                     | Description                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apsEnvMode: string` (required)              | Sets the APS Environment Entitlement. Determines whether to use the development or production Apple Push Notification service (APNs). <br/> Values: `"development"` or `"production"`                                                                                                                                                                                                    |
| `iosDeploymentTarget: string` (required)     | Sets the deployment target of the notification service extension for iOS. This should match the deployment target of the main app. <br/>Ex: `"13.4"`                                                                                                                                                                                                                                     |
| `androidIcons?: NotifeeAndroidIcon[]`        | Specifies Android icons to be added to the appropriate resource folders for notification purposes. Each icon should be defined with a name, path, and type (large or small). <br/>Ex: `[{ name: "ic_small_logo", path: "./assets/logo.png", type: "small" }]`                                                                                                                            |
| `enableCommunicationNotifications?: boolean` | Enables communication notifications, which adds the necessary configurations for communication notifications as mentioned in https://github.com/invertase/notifee/pull/526.                                                                                                                                                                                                              |
| `appleDevTeamId?: string`                    | Automatically signs the app and the notification service extension targets with the provided Apple developer team ID.                                                                                                                                                                                                                                                                    |
| `customNotificationServiceFilePath?: string` | Specifies the path to a custom notification service file, which should already include the necessary configurations for Notifee along with any additional customizations. You can build upon the default NotificationService.m file of this package. <br/> Ex: `"./assets/notifee/NotificationService.m"`.                                                                               |
| `backgroundModes?: string[]`                 | Specifies the background modes to enable for the app. If not provided, the default value will be: `["remote-notification"]`. On the other hand, an empty array `[]` will signal to the plugin to skip the backgroundModes step completly. iOS only.<br/> See possible values here: https://developer.apple.com/documentation/bundleresources/information_property_list/uibackgroundmodes |
| `verbose?: boolean`                          | Enables verbose logging output during the plugin configuration process. When set to `true`, the plugin will log detailed information about each step. Defaults to `false`.                                                                                                                                                                                                               |

## 🤩 STARS 🤩

If this was of any use to you, give it a 🌟 :)

## 💸 Feeling grateful and want to support me 💸

<p style="font-size:1.5em;">You can support me via <a href="https://ko-fi.com/kevpug">ko-fi</a>.</p>


## 📜 License 📜

This package is made available under the [MIT license](https://github.com/evennit/notifee-expo-plugin/blob/main/LICENSE).

<p style="font-size:0.69em; margin:123px;">Happy coding :)</p>
