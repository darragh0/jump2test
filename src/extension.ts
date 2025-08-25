import * as vscode from "vscode";
import { debug } from "./common/logger.js";
import { main } from "./ext/main.js";

export function activate(context: vscode.ExtensionContext): void {
  debug("✅ jump2test activated");
  const disposable = vscode.commands.registerCommand("jump2test.findTests", main);
  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  debug("✅ jump2test deactivated");
}
