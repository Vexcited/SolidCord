# SolidCord

> Some random custom fully handmade client for Discord that was made with performance in mind.

By handmade, I mean without using `discord.js` or any npm package that gives us helpers for Discord's API, even typings.

## Features

- Made with SolidJS and NeutralinoJS.
- Fast, even on low-end hardware - tested on a Raspberry Pi 4B.

## Usage

### Windows

#### Prerequisites

Make sure you enabled accessing localhost from a UWP context using the following command **with administrator rights**.

```powershell
CheckNetIsolation.exe LoopbackExempt -a -n="Microsoft.Win32WebViewHost_cw5n1h2txyewy"
```

This will prevent to have a blank white screen when starting the app, according to [NeutralinoJS' docs](https://neutralino.js.org/docs/getting-started/your-first-neutralinojs-app#step-1-creating-a-new-app).

This is not required, but [they also recommend](https://neutralino.js.org/docs/getting-started/your-first-neutralinojs-app#step-1-creating-a-new-app) to install the [WebView2 runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section). 

#### Installation

> TODO: Add binary installation process.

### Linux

#### Prerequisites

Make sure you have `curl` and `libwebkit2gtk` installed.

#### Installation

> TODO: Add binary installation process.

### macOS

#### Prerequisites

Make sure you have `curl` installed. You can test it by running `curl --version` in your Terminal.

#### Installation

> TODO: Add binary installation process.

## Contribute

### Set-up the development environment

```bash
git clone https://github.com/Vexcited/SolidCord
cd SolidCord

# Use pnpm to install dependencies.
pnpm install
```

### Scripts

> Run `pnpm neu update` to update binaries for NeutralinoJS.

- `dev:browser`: Runs development server to make it work in a any web browser, just go to `http://localhost:3000`.
- `dev:window`: Runs development app with a Neutralino window.
- `build`: Builds a release version of the app.
- `preview`: Builds the app and run it.

