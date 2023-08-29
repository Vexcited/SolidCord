/// Should be ran from the root of the project.
/// This script will update the version in the Tauri configuration files.

import { readFileSync, writeFileSync } from "fs";
const version = process.argv[2];

const updateFile = (path) => {
  console.log(`Updating ${path} version to ${version}`);

  const raw = readFileSync(path, { encoding: "utf8" });
  const json = JSON.parse(raw);

  json.package.version = version;
  writeFileSync(path, JSON.stringify(json, null, 2));
};

updateFile("./src-tauri/tauri.beta.conf.json");
updateFile("./src-tauri/tauri.conf.json");
