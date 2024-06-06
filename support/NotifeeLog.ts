export class NotifeeLog {
  static log(str: string) {
    console.log(`\tnotifee-expo-plugin: ${str}`);
  }

  static error(str: string) {
    console.error(`\tnotifee-expo-plugin: ${str}`);
  }
}
