import * as path from "path";
import * as vscode from "vscode";
import { CommonErr } from "./common/const";
import { debug } from "./common/logger";
import { getTestQuery } from "./common/main";
import { ExtErr } from "./ext/const";
import { openFile, showErr, showFilesQuickPick, showMsg } from "./ui/main";

export function activate(context: vscode.ExtensionContext): void {
  debug("Activate invoked");

  const disposable = vscode.commands.registerCommand(
    "jump2test.findTests",
    main
  );

  context.subscriptions.push(disposable);
}

const main = async (): Promise<void> => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    showErr(ExtErr.NO_ACTIVE_EDITOR);
    return;
  }

  const curFilePath = editor.document.fileName;
  debug(`Current file path: "${curFilePath}"`);
  const res = getTestQuery(curFilePath);

  if (res.err && res.err === CommonErr.NOT_IN_FILE) {
    debug(`info: ${res.err}`);
    showMsg(res.err);
    return;
  }

  if (res.err) {
    debug(`Error: ${res.err}`);
    showErr(res.err);
    return;
  }

  const globalExlude = vscode.workspace.getConfiguration("files.exclude");
  // TODO: Make configurable
  const localExclude = {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/out/**": true,
    "**/build/**": true,
    "**/.git/**": true,
  };

  const query = res.data as string;
  const exclude: vscode.GlobPattern = Object.keys({
    ...localExclude,
    ...globalExlude,
  }).join(",");

  const pattern = `**/${query}.{ts,js}`;
  debug(`Pattern to match: "${pattern}"`);

  let files = await vscode.workspace.findFiles(pattern, exclude);
  let isFallback = false;
  debug(`Found ${files.length} related test files`);

  if (files.length === 0) {
    // Retry with just the file name (without directories or extension)
    const baseName = path.parse(query).name;
    const fallbackPattern = `**/${baseName}.{ts,js}`;

    if (fallbackPattern !== pattern) {
      debug(`No matches; retrying with file name only: "${fallbackPattern}"`);
      isFallback = true;
      files = await vscode.workspace.findFiles(fallbackPattern, exclude);
      debug(`Fallback search found ${files.length} related test files`);

      if (files.length === 0) {
        debug(`No related test files found after fallback search`);
        showErr(CommonErr.NO_TESTS);
        return;
      }
    }
  }

  if (files.length === 1) {
    await openFile(files[0].fsPath);
    return;
  }

  const selected = await showFilesQuickPick(
    files,
    isFallback
      ? { title: "⚠️ Possible matches (may be unrelated)" }
      : { title: "✅ Matches found" }
  );

  if (selected) await openFile(selected.fsPath);
};

export function deactivate(): void {
  // no-op
}
