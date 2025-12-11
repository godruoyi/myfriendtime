# My Friend Time

An open-source macOS menubar app to keep track of your friends across different time zones.

## Screenshot

![MyFriendTime Setting](https://github.com/user-attachments/assets/ccafd582-ec0a-47f1-8783-18094b192a8f)

![MyFriendTime](https://github.com/user-attachments/assets/4eea797f-0824-4bad-aac0-a477008e0ad0)

## Installation

### From Releases (Recommended)

The easiest way to install MyFriendTime is to download the latest `.dmg` file from the [Releases](https://github.com/godruoyi/myfriendtime/releases) page.

1.  Go to the latest release.
2.  Download the `*.dmg` file.
3.  Open the `.dmg` file and drag the `MyFriendTime` app into your `Applications` folder.

### Building from Source

If you prefer to build the application from the source code, you will need to have [Rust](https://www.rust-lang.org/) and [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/godruoyi/myfriendtime.git
    cd YOUR_REPOSITORY
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm run tauri dev
    ```

4.  **Build the application for production:**

    ```bash
    pnpm run tauri build
    ```

    The bundled application will be available in the `src-tauri/target/release/bundle/` directory.

## Issues

1. “myfriendtime.app” is damaged and can’t be opened. You should move it to the Trash.

Our app is not notarized by Apple, so you may encounter this error when trying to open it for the first time. To bypass this, you can use the following command in your terminal:

```bash
sudo xattr -r -d com.apple.quarantine /Applications/myfriendtime.app
```

2. We cannot support delete/edit friend right now, please open `friends.json` and edit it manually.

MacOS: `~/Library/Application Support/app.myfriendtime/friends.json`

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
