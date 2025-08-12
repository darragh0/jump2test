import * as vscode from "vscode";

export async function openFile(filePath: string): Promise<void> {
  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);
}

export function showErr(message: string): void {
  void vscode.window.showErrorMessage(message);
}

export function showMsg(message: string): void {
  void vscode.window.showInformationMessage(message);
}

type QuickPickFileItem = vscode.QuickPickItem & { uri?: vscode.Uri };

export async function showFilesQuickPick(
  files: vscode.Uri[],
  options?: { title?: string; separatorLabel?: string }
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
    placeHolder: "Select a test file to open",
    title: options?.title,
    canPickMany: false,
    matchOnDescription: false,
    matchOnDetail: false,
  });

  return picked && "uri" in picked ? picked.uri : undefined;
}
