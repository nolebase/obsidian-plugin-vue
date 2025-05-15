# Obsidian Plugin Vue

> [!NOTE]
> This is one of the plugins of the collections of plugins called [Nólëbase Integrations](https://github.com/nolebase/integrations). You can explore the other plugins in the collection in [the official documentation site of Nólëbase Integrations](https://nolebase-integrations.ayaka.io).

---

**Write your notes in [Obsidian](https://obsidian.md/) with [Vue.js](https://vuejs.org/).**

## 😎 How to install

> [!WARNING]
> Currently Obsidian Vue Plugin is in alpha stage, it wasn't guaranteed to work properly and keep the compatibility with the future versions of itself.
>
> But it is encouraged to try it out and give feedbacks. If you find and bugs or have any suggestions, please feel free to open an issue on [GitHub](https://github.com/nolebase/obsidian-plugin-vue/issues).

Currently, it is a bit hard to install the plugin for now before it is published to the official Obsidian plugin store. Manual downloading and installation is required.

### Install with beta testing helper [BRAT](https://tfthacker.com/brat-quick-guide) plugin

1. Install the [BRAT](https://tfthacker.com/brat-quick-guide) plugin right from the official Obsidian plugin store.
2. Enable the BRAT plugin in the community plugins settings menu.
3. Open Command palette to choose `BRAT: Plugins: Add a beta plugin for testing`.
4. Copy and paste the following link to the first field of the new prompted dialog:

```txt
https://github.com/nolebase/obsidian-plugin-vue
```

5. Find the needed released version on [Release page of Obsidian Vue Plugin](https://github.com/nolebase/obsidian-plugin-vue/releases), for example, fill in `0.1.0`.
6. Enable the "Vue" plugin from the `Installed plugins` list.

### Install manually

1. Navigate to the [Release page of Obsidian Vue Plugin](https://github.com/nolebase/obsidian-plugin-vue/releases)
2. Find the [latest version of the plugin](https://github.com/nolebase/obsidian-plugin-vue/releases/latest).
3. Download the `main.js` file and `manifest.json` file.
4. Open up the `.obsidian/plugins` directory of your Obsidian vault.
5. If no `.obsidian/plugins` directory exists, create one.
6. Create a new directory named `obsidian-plugin-vue` inside the `.obsidian/plugins` directory.
7. Move `main.js` file and `manifest.json` file into the `obsidian-plugin-vue` directory.

The directory structure should look like this after these steps:

```shell
❯ tree
.
├── main.js
├── manifest.json
```

8. Enable the "Vue" plugin from the "Installed plugins" list.

## ⏳ TODOs

- [ ] Auto completion for CSS classes.
- [ ] Annotation decoration for Vue identifiable classes.

## 💻 How to develop

1. As [Build a plugin - Developer Documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) has suggested, create a separate vault for development.
2. (Optional) Install the hot-reload plugin: [pjeby/hot-reload](https://github.com/pjeby/hot-reload).
3. Create a `.obsidian/plugins` directory in the vault root.
4. Clone this repository into the `.obsidian/plugins` directory.
5. Install dependencies

```shell
pnpm install
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
ni
```

6. Build the plugin

```shell
pnpm run build
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr build
```

7. Reload Obsidian to see the changes. (If you use the hot-reload plugin, you don't need to reload Obsidian manually.)

> Reloading can be called from the command palette with `Reload app without saving` command.

## 🔨 How to build

```shell
pnpm run build
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr build
```

### Written with ♥
