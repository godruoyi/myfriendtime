# My Friend Time

An open-source macOS menubar app to keep track of your friends across different time zones.

---

## Description

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

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
