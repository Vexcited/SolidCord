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

export const getCurlInstallation = async (): Promise<string> => {
  if (NL_OS !== "Windows") return "curl";
  const app_data_path = await getAppDataPath();

  const curl_folder_contents = await Neutralino.filesystem.readDirectory(app_data_path + "/curl");
  const curl_extracted_folder = curl_folder_contents.find((item) => item.type === "DIRECTORY" && item.entry.startsWith("curl"));
  if (!curl_extracted_folder) throw new Error("couldn't find `curl` folder.");

  const curl_path = app_data_path + "/curl/" + curl_extracted_folder.entry + "/bin/curl.exe";
  return curl_path;
}

export const checkCurlInstallation = async (): Promise<boolean> => {
  if (NL_OS !== "Windows") return true;
  const curl_path = await getCurlInstallation();

  try {
    const stats = await Neutralino.filesystem.getStats(curl_path);
    return stats.isFile;
  }
  catch {
    return false;
  }
}

export const installCurlWindows = async (): Promise<boolean> => {
  if (NL_OS !== "Windows") return true;
  const app_data_path = await getAppDataPath();
  console.info("[installCurlWindows] processing the installation of curl inside", app_data_path);
  
  const curl_zip_url = "https://curl.se/windows/latest.cgi?p=win64-mingw.zip";
  const curl_zip_path = app_data_path + "/curl.zip";
  
  // Download a file using PowerShell, should be version >= 3.0 so we can use `Invoke-WebRequest`.
  // Taken from <https://superuser.com/a/747044>.
  console.info("[installCurlWindows] will download curl from", curl_zip_url, "to `./curl.zip`");
  const curl_download_response = await Neutralino.os.execCommand(`powershell.exe -command "iwr -outf ${curl_zip_path} ${curl_zip_url}"`);
  console.info("[installCurlWindows] download finished with the following output", curl_download_response);
  
  const curl_unzip_path = app_data_path + "/curl";
  
  // Unzip the downloaded file using PowerShell with `Expand-Archive`
  // Taken from <https://superuser.com/a/1533443>.
  console.info("[installCurlWindows] will extract `./curl.zip` to `./curl` folder.");
  const curl_unzip_response = await Neutralino.os.execCommand(`powershell -command "Expand-Archive -Force -LiteralPath ${curl_zip_path} -DestinationPath ${curl_unzip_path}"`)
  console.info("[installCurlWindows] extract done with the following output", curl_unzip_response);

  const curl_folder_contents = await Neutralino.filesystem.readDirectory(curl_unzip_path);
  const curl_extracted_folder = curl_folder_contents.find((item) => item.type === "DIRECTORY" && item.entry.startsWith("curl"));
  if (!curl_extracted_folder) {
    console.error("[installCurlWindows] extracted content from `curl.zip` not found in `curl` folder.");
    return false;
  }

  const curl_bin_folder = curl_unzip_path + "/" + curl_extracted_folder.entry + "/bin";
  const curl_binary = curl_bin_folder + "/curl.exe";
  
  console.info("will check if `curl.exe` is found under the bin path.");
  const curl_exe_check_response = await Neutralino.filesystem.getStats(curl_binary);
  if (curl_exe_check_response.isFile) {
    console.info("found `curl.exe`.");
  }

  const curl_certificate_url = "https://curl.se/ca/cacert.pem";
  const curl_certificate_path = curl_bin_folder + "/cacert.pem";

  console.info("[installCurlWindows] will download curl's certificate from", curl_certificate_url);
  const curl_certificate_download_response = await Neutralino.os.execCommand(`powershell.exe -command "iwr -outf ${curl_certificate_path} ${curl_certificate_url}"`);
  console.info("[installCurlWindows] download finished with the following output", curl_certificate_download_response);

  const curlrc_content = `cacert = "${curl_certificate_path}"`;
  const curlrc_path = curl_bin_folder + "/.curlrc";

  console.info("will create a `.curlrc` file in", curlrc_path);
  const curlrc_write_response = await Neutralino.filesystem.writeFile(curlrc_path, curlrc_content);
  console.log("done with following output", curlrc_write_response);

  return true;
}