# SolidCord

> A Tauri+SolidJS handcrafted client for Discord that was made with performance in mind while keeping the look of Discord. \
> By "handcrafted", I actually mean "without using any package that gives us helpers for Discord's API, even typings".



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

Please, try to stick with `pnpm` so we don't confict with any other package manager.

### Available Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Runs front-end (Vite) development server, **without Tauri**. |
| `pnpm build` | Builds the front-end, **without Tauri**. |
| `pnpm tauri dev` | Runs front-end (Vite) development server, **with Tauri** at the same time. |

### Recommended IDE Setup / Extensions

Everything mentionned here is optional, but you'll get a better DX by installing them.

#### [VS Code](https://code.visualstudio.com/)

- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [PostCSS Language Support](https://marketplace.visualstudio.com/items?itemName=csstools.postcss)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)