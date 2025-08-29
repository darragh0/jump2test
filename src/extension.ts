import * as vscode from "vscode";
import { debug } from "./common/logging";
import { main } from "./ext";

async function activate(context: vscode.ExtensionContext): Promise<void> {
  debug("=== jump2test activated ===");
  const disposable = vscode.commands.registerCommand("jump2test.findTests", main);
  context.subscriptions.push(disposable);
}

function deactivate(): void {
  debug("=== jump2test deactivated ===");
}

export { activate, deactivate };
