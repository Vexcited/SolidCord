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
  const app_data_path = await getAppDataPath();

  try {
    const stats = await Neutralino.filesystem.getStats(app_data_path + "/curl.exe")
    return stats.isFile;
  }
  catch {
    return false;
  }
}

export const installCurlWindows = async (): Promise<boolean> => {
  if (NL_OS !== "Windows") return true;
  const app_data_path = await getAppDataPath();

  const curl_zip_url = "https://curl.se/windows/latest.cgi?p=win64-mingw.zip";
  const curl_zip_path = app_data_path + "/curl.zip";

  // Download a file using PowerShell, should be version >= 3.0 so we can use `Invoke-WebRequest`.
  // Taken from <https://superuser.com/a/747044>.
  const response = await Neutralino.os.execCommand(`powershell.exe -command "iwr -outf ${curl_zip_path} ${curl_zip_url}"`);
  console.log(response);

  const curl_unzip_path = app_data_path + "/curl";

  // Unzip the downloaded file using PowerShell with `Expand-Archive`
  // Taken from <https://superuser.com/a/1533443>.
  const response2 = await Neutralino.os.execCommand(`powershell -command "Expand-Archive -Force ${curl_zip_path} ${curl_unzip_path}"`)
  console.log(response2);

  // TODO: Get `curl.exe` if not exists and produce everything to make it work.
  // <https://www.techtutsonline.com/setup-curl-in-windows/#setup_curl_windows>
  return true;
}