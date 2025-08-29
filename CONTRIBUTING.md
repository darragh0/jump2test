# Contributing

## Prerequisites

### Terminology

- **Stack**: A specific technology or framework (language, a framework, a library, or tool)
- **Source File**: A file containing the source code for a specific feature or module.
- **Test File**: A file containing tests corresponding to a specific source file.
- **Glob**: A pattern of literal and/or wildcard characters used to find files in a directory.

### Environment Setup

- Node.js 20+
- pnpm 9+
- VSCode 1.75+

```bash
pnpm install
```

## Adding a new Stack

1. Take a look at the [Stack interface](src/stack/interface.ts) and [existing implementations](src/stack/impl/) to get an idea of how to implement a new stack.
2. Add your stack to the [README](README.md)
3. Add your stack to the `enabledStacks` config option in [package.json](package.json)

```jsonc
"jump2test.enabledStacks": {
  "type": "array",
  "description": "Stacks to enable Jump2Test for",
  "items": {
    "type": "string",
    "enum": [
      "react",
      // ...
      "your-stack"
    ]
  },
  "default": [
    "react",
    // ...
    "your-stack"
  ]
}
```

## Development

If you would like to contribute to the project, you can do so by making a pull request.
Make sure to checkout to a feature branch from `main` and make your changes here.

1. To build the extension, run:

   ```bash
   pnpm package
   # Produces ./jump2test-<version>.vsix
   ```

2. Launch for testing
   - Press `F5` to start an Extension Development Host

3. Optionally, install locally without publishing

   ```bash
   chmod +x scripts/install.sh && scripts/install.sh [vscode|cursor]
   ```

## Pull Requests

Once you are satisfied that your feature works as expected, you can make a [pull request](https://github.com/darragh0/jump2test/pulls), and I'll review it as soon as possible!
