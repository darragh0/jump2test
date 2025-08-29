<br />
<br />
<div align="center">
  <div>
    <img src="https://raw.githubusercontent.com/darragh0/hoppy/refs/heads/main/assets/logo.png" width="150" />
  </div>

  <p><i>Quickly jump to test files in <a href="https://code.visualstudio.com">VSCode</a></i></p>

   <div>
     <a href="https://github.com/darragh0/hoppy/stargazers">
       <img src="https://img.shields.io/github/stars/darragh0/hoppy?colorA=363a4f&colorB=b7bdf8&style=for-the-badge">
     </a>
     <a href="https://github.com/darragh0/hoppy/issues">
       <img src="https://img.shields.io/github/issues/darragh0/hoppy?colorA=363a4f&colorB=f5a97f&style=for-the-badge">
     </a>
     <a href="https://github.com/darragh0/hoppy/contributors">
       <img src="https://img.shields.io/github/contributors/darragh0/hoppy?colorA=363a4f&colorB=e8abe6&style=for-the-badge">
     </a>
  </div>
  <div>
     <a href="https://github.com/darragh0/hoppy/releases/latest">
       <img src="https://img.shields.io/github/v/release/darragh0/hoppy?colorA=363a4f&colorB=a6da95&style=for-the-badge">
     </a>
     <a href="https://marketplace.visualstudio.com/items?itemName=darragh0.hoppy">
       <img src="https://img.shields.io/visual-studio-marketplace/d/darragh0.hoppy?colorA=363a4f&colorB=94e2d5&style=for-the-badge">
     </a>
  </div>
</div>
<br />

## Supported Stacks

- [React](https://react.dev/)
- [Ember.js](https://emberjs.com/)

## Usage

- Hold `Cmd` (Mac) or `Ctrl` (Win/Linux) and double tap `T` to find tests for the current file
- Change the keyboard shortcut via `hoppy.findTests` in `Preferences: Open Keyboard Shortcuts`

## Configuration

The following settings are provided. You can access them [here](vscode://settings/hoppy.)

```jsonc
{
  "hoppy": {
    // Automatically open test file when only one match is found
    "autoOpen": true,
    // Allow fallback search if no test files are found
    "allowFallback": true,
    // Keep preview tab open when opening test file (prevent tab replacement)
    "keepSourceOpen": false,
    // Enable jumping from test files to source files (Beta)
    "jumpToSourceBeta": false,
    // Stacks to enable
    "enabledStacks": ["react", "ember", "ruby"],
  },
}
```

## Bugs & Feature Requests

If you encounter any bugs or have feature requests or general questions or feedback, please [open an issue](https://github.com/darragh0/hoppy/issues/new) with the `bug` or `feature-request` label.

## Prospective Updates

- [ ] Replace built-in VS Code search with quicker tool similar to `ripgrep`
- [ ] Make editor agnostic (currently only supports VSCode)
- [ ] Add support for more frameworks

## Acknowledgements

[Seo and web icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/seo-and-web)
