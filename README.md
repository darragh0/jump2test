# Jump to Test

A VS Code/Cursor extension to quickly find and jump to corresponding test files for the current file.
Currently, the only supported environment is **EmberJS projects**. Support for **React** and **Rails** coming soon!

## Usage

- Hold `Cmd` (Mac) or `Ctrl` (Win/Linux) and double tap `T` to find tests for the current file
- A Single test file opens immediately
- Multiple test files show a selection dialog

## Error Messages

- **No active editor**: There is no active editor open
- **Corrupted file path format :(**: The provided file path is empty or invalid
- **You can only use this command in a file >:(**: Run the command from a real file (not an empty or unsaved editor)
- **No test files found :O**: No matching test files were derived for the current file
- **Environment not yet supported :(**: The current framework/environment is not yet supported
- **Not a .ts or .js file >:(**: Ember support only handles `.ts` and `.js` source files
- **File seems to be a test file :/**: Files ending in `-test.*` are not processed

## Customization

To change the keyboard shortcut:

1. Open VS Code Settings (`Cmd+,` or `Ctrl+,`)
2. Search for "Keyboard Shortcuts"
3. Search for "Find Tests for Current File"
4. Click the pencil icon to edit the shortcut

## Development

Local workflow (no shell scripts required):

1. Edit files in the `src/` directory
2. Build the extension

   ```bash
   npm install
   npm run compile
   ```

3. Launch for testing

   - VS Code: press `F5` to start an Extension Development Host
   - Cursor: open this folder and run the built-in "Run Extension" task or use the VS Code flow

4. Optionally install locally without publishing

   ```bash
   npx vsce package
   # Produces jump2test-<version>.vsix
   code --install-extension jump2test-*.vsix   # VS Code
   cursor --install-extension jump2test-*.vsix # Cursor
   ```

Or simply iterate with the built-in debugger (recommended for development).
