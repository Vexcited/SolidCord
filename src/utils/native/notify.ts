import { isPermissionGranted, requestPermission, sendNotification, type Options } from "@tauri-apps/api/notification";

export const checkNativeNotificationPermission = async () => {
  let permissionGranted = await isPermissionGranted();

  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }

  return permissionGranted;
};

export const sendNativeNotification = async (options: Options) => {
  const isAllowed = await checkNativeNotificationPermission();
  if (!isAllowed) return; // TODO: Display some stuff here, to explain users why they don't receive notifications.

  return sendNotification(options);
};
