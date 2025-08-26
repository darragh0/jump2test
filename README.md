<div align="center" style="margin: 1rem 0 1.5rem 0">
  <img style="margin-bottom: 1.5rem" src="./img/logo.png" width="150" />

  <p><i>Quickly jump to test files in <a href="https://code.visualstudio.com">VSCode</a></i></p>

   <div style="margin-bottom: .5rem">
     <a href="https://github.com/darragh0/jump2test/stargazers">
       <img src="https://img.shields.io/github/stars/darragh0/jump2test?colorA=363a4f&colorB=b7bdf8&style=for-the-badge">
     </a>
     <a href="https://github.com/darragh0/jump2test/issues">
       <img src="https://img.shields.io/github/issues/darragh0/jump2test?colorA=363a4f&colorB=f5a97f&style=for-the-badge">
     </a>
     <a href="https://github.com/darragh0/jump2test/contributors">
       <img src="https://img.shields.io/github/contributors/darragh0/jump2test?colorA=363a4f&colorB=e8abe6&style=for-the-badge">
     </a>
  </div>
  <div>
     <a href="https://github.com/darragh0/jump2test/releases/latest">
       <img src="https://img.shields.io/github/v/release/darragh0/jump2test?colorA=363a4f&colorB=a6da95&style=for-the-badge">
     </a>
     <a href="https://marketplace.visualstudio.com/items?itemName=darragh0.jump2test">
       <img src="https://img.shields.io/visual-studio-marketplace/d/darragh0.jump2test?colorA=363a4f&colorB=94e2d5&style=for-the-badge">
     </a>
  </div>
</div>

## Supported Frameworks

- [React](https://react.dev/)
- [Ember.js](https://emberjs.com/)

## Usage

- Hold `Cmd` (Mac) or `Ctrl` (Win/Linux) and double tap `T` to find tests for the current file

❗ Change the keyboard shortcut via `jump2test.findTests` in `Preferences: Open Keyboard Shortcuts`

## Configuration

The following settings are provided:

```json
{
  "jump2test": {
    // Automatically open test file when only one match is found
    "autoOpen": true,
    // Allow fallback search if no test files are found
    "allowFallback": true,
    // Keep preview tab open when opening test file (prevent tab replacement)
    "keepSourceOpen": false
  }
}
```

## Development

❗ `npm` or `pnpm` required

1. To build the extension, run:

   ```bash
   pnpm install
   pnpm run compile
   ```

2. Launch for testing
   - Press `F5` to start an Extension Development Host
     <br /><br />

3. Optionally install locally without publishing

   ```bash
   vsce package
   # Produces ./jump2test-<version>.vsix
   code --install-extension ./jump2test-*.vsix   # VS Code
   cursor --install-extension ./jump2test-*.vsix # Cursor
   ```
