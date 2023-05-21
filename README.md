# SolidCord

> Still a WIP !

A [Tauri](https://tauri.app/) + [SolidJS](https://www.solidjs.com/) handcrafted client for [Discord](https://discord.com/) that was made with performance in mind while keeping the look of Discord.

> By "handcrafted", I actually mean "without using any package that gives us helpers for Discord's API, even typings".

## Features

### Simultaneous connections

Whenever you add an account, a connection to the gateway with this account will be kept until the app is quitted or until you sign out the account from SolidCord.

That allows to have notifications for multiple accounts.

Of course, this behavior can be disabled by signing out of the account in the account selector.

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
