# Random Walk

A Orca Note plugin that helps you recap notes.

## Usage

1. Download the zip file from the [releases page](https://github.com/sethyuan/orca-random-walk/releases) and extract it into Orca Note's `plugins` directory.
2. Start/restart Orca Note, enable the plugin under the app's settings.
3. Prepare a query block as your data source, copy it's block ID using the block context menu.
   ![image](https://github.com/user-attachments/assets/b628d7ea-5125-4106-bf69-1820d44551a7)
   ![image](https://github.com/user-attachments/assets/f73877f1-7895-4589-807c-3cca7a2fbe3d)
4. Extract the block ID from the copied link. E.g, `orca-note://i8huk7b2mmwkv/block?blockId=29`, the block ID is `29` here. Configure it in the plugin settings.
5. Click the button in the top toolbar of Orca Note ​every time you want to randomly recap a note.

## Development Setup

1. Place the the project's folder into Orca Note's `plugins` directory (Orca Note's directory is located under your user's documents directory, e.g. `/Users/username/Documents/orca`, `C:\Users\username\Documents\orca`).
2. Run `pnpm build` on the project's root directory to build the plugin.
3. Start/restart Orca Note, you'll find the plugin under the app's settings, enable the plugin and you're good to go.
