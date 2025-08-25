import * as vscode from "vscode";
import { QuickPickFileItem, QuickPickOptions } from "./types.js";

async function openFile(path: string): Promise<void> {
  const doc = await vscode.workspace.openTextDocument(path);
  await vscode.window.showTextDocument(doc);
}

/** Show quick pick of files & return the selected URI (or undefined) */
async function showFilesQuickPick(
  files: readonly vscode.Uri[],
  options?: QuickPickOptions
): Promise<vscode.Uri | undefined> {
  const items: QuickPickFileItem[] = files.map((uri) => ({
    label: vscode.workspace.asRelativePath(uri.fsPath, false),
    uri,
  }));

  if (options?.separatorLabel) {
    items.unshift({
      label: options.separatorLabel,
      kind: vscode.QuickPickItemKind.Separator,
    });
  }

  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: "Select a test file to jump to",
    title: options?.title,
    canPickMany: false,
    matchOnDescription: false,
    matchOnDetail: false,
  });

  return picked && "uri" in picked ? picked.uri : undefined;
}

export { openFile, showFilesQuickPick };
