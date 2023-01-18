export const getAppDataPath = async () => {
  const data_path = await Neutralino.os.getPath("data");
  const app_data_path = data_path + "/SolidCord";

  try { await Neutralino.filesystem.getStats(app_data_path) }
  catch (err) {
    const error = err as Neutralino.Error;
    
    /** Directory doesn't exist. */
    if (error.code === "NE_FS_NOPATHE") {
      await Neutralino.filesystem.createDirectory(app_data_path);
    }
  }

  return app_data_path;
}

export const checkCurlInstallation = async (): Promise<boolean> => {
  if (NL_OS !== "Windows") return true;

  // TODO: Get `curl.exe` if not exists and produce everything to make it work.
  // <https://www.techtutsonline.com/setup-curl-in-windows/#setup_curl_windows>
  return true;
}