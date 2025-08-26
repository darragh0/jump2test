import * as vscode from "vscode";
import { debug } from "./common/logger";
import { main } from "./ext/main";

async function activate(context: vscode.ExtensionContext): Promise<void> {
  debug("✅ jump2test activated");
  const disposable = vscode.commands.registerCommand("jump2test.findTests", main);
  context.subscriptions.push(disposable);
}

function deactivate(): void {
  debug("✅ jump2test deactivated");
}

export { activate, deactivate };
