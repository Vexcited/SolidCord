# SolidCord

> Still a WIP !

A [Tauri](https://tauri.app/) + [SolidJS](https://www.solidjs.com/) **handcrafted client** for [Discord](https://discord.com/) that was made with *performance in mind*.

> By "handcrafted", I actually mean "without using any package that gives us helpers for Discord's API, even typings".

## Features

### Simultaneous connections

Whenever you add an account, a connection to the gateway with this account will be kept until the app is exited - or you remove the account from SolidCord.

That allows to have notifications and message caching for multiple accounts.

Of course, this behavior can be toggled in the account selector - TODO.

### SQLite caching

> Internally uses [`tauri-plugin-sql#v1`](https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/sql)

Messages, guilds, and basically anything Discord could return you is cached into multiple SQLite databases locally.

This allows offline usage - readonly -, but also faster load times.

If you don't want caching, just turn it off in settings ! (TODO)

#### Where are the databases files ?

- On Windows, `C:\Users\username\AppData\Roaming\com.github.vexcited.solidcord\`
- On Linux, TODO
- On macOS, TODO

You can browse the content of those `.db` files using any SQLite browser,
such as <https://sqliteviewer.app> if you want to do it in your browser directly, for example.

### Native HTTP / WebSockets

> Internally uses Tauri's HTTP API and [`tauri-plugin-websocket#v1`](https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/websocket)

Requests aren't done by the WebView but by Rust directly !

Concerning websockets, I'm trying to see if I can also do `zlib-stream` compression and `etf` encoding there.

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

Please, try to stick with `pnpm` so we don't conflict with any other Node.js package manager.

If you need to update `cargo` packages for `src-tauri` folder,

```bash
cd src-tauri
cargo update
```

### Available Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Runs front-end (Vite) development server, **without Tauri**. |
| `pnpm build` | Builds the front-end, **without Tauri**. |
| `pnpm tauri dev` | Runs front-end (Vite) development server, **with Tauri** at the same time. |

### Recommended IDE Setup / Extensions

Everything mentioned here is optional, but you'll get a better DX by installing them.

#### [VS Code](https://code.visualstudio.com/)

- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [UnoCSS](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
