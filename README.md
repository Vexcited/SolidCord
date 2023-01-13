# SolidCord

> Some random custom handmade client for Discord that was made with performance in mind.

## Features

- Made with SolidJS and NeutralinoJS

## Installation

### Windows

Windows support is very limited currently. I'll need to do more testing to see if our cURL wrapper works well with Windows.

> TODO: Add binary installation process

## Linux

Make sure you have `curl` and `libwebkit2gtk` installed.

> TODO

## macOS

Make sure you have `curl` installed.

> TODO

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
