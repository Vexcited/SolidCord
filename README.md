# SolidCord

A work in progress fast and open-source handcrafted web client for [Discord](https://discord.com/) that is made with performance in mind. Uses [Tauri](https://tauri.app/) and [SolidJS](https://solidjs.com/).

> By "handcrafted", I actually mean "without using any package that gives us helpers for Discord's API, even typings".

## Current State

It's very very very early in development.
I might open issues in the future to track developement of features.

Also, concerning the design aspect: for now, the app is only made for dark mode systems and doesn't have any settings. It'll support light mode in the future, do not worry.

## Features

### Simultaneous connections

Whenever you add an account, a connection to the gateway with this account will be kept until the app is exited - or you remove the account from SolidCord.

That allows to have notifications and message caching for multiple accounts.

Of course, this behavior can be toggled in the account selector - TODO.

### Native HTTP / WebSockets

> Internally uses Tauri's HTTP API and [`tauri-plugin-websocket#v1`](https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/websocket)

Requests aren't done in the WebView (using the web Fetch API) but within Rust directly !

Concerning WebSockets, I'm trying to see if I can also do `zlib-stream` compression and `etf` encoding there.

## Development

### Environment

```bash
# Clone the repository.
git clone https://github.com/Vexcited/SolidCord

# Navigate into the folder, if not done.
cd SolidCord

# Use pnpm to install dependencies.
pnpm install
```

Please, try to stick with `pnpm` so we don't conflict with any other package manager.

If you need to update `cargo` packages for the `src-tauri` folder,

```bash
cd src-tauri
cargo update
```

### Available Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm lint` | Lint the codebase to detect any styling issue. |
| `pnpm tauri dev` | Run a development version of the app. |
| `pnpm tauri build` | Build into a binary. |

### Recommended IDE Setup / Extensions

Everything mentioned here is optional, but you'll get a better DX by installing them.

#### [VS Code](https://code.visualstudio.com/)

- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [UnoCSS](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Acknowledgements

- [dolfies](https://github.com/dolfies) for his `cordapi` that helps me to retrieve the client properties.
