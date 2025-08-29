import * as vscode from "vscode";
import { debug } from "./common/logging";
import { main } from "./ext";

async function activate(context: vscode.ExtensionContext): Promise<void> {
  debug("=== hoppy activated ===");
  const disposable = vscode.commands.registerCommand("hoppy.findTests", main);
  context.subscriptions.push(disposable);
}

function deactivate(): void {
  debug("=== hoppy deactivated ===");
}

export { activate, deactivate };
