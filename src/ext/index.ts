import fs from "fs";
import * as vscode from "vscode";

import { debug } from "@common/logging";
import { ErrMsg, InfoMsg } from "@common/msg/const";
import { openFile, showErr, showFilesQuickPick, showInfo } from "@common/ui";
import { QuickPickTitle } from "@common/ui/const";
import { getConfigVal } from "@ext/config/main";
import { checkValidExt, findFiles, getTestQuery } from "@ext/files";
import { detectStack, findNearestRoot } from "@stack/detection";

/** Entrypoint: find and open related test file(s) */
async function main(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    showInfo(InfoMsg.NO_ACTIVE_EDITOR);
    return;
  }

  const curPath = editor.document.fileName;
  debug(`Current path: '${curPath}'`);

  if (!fs.existsSync(curPath)) {
    showInfo(InfoMsg.NOT_IN_FILE);
    return;
  }

  const rootDir = findNearestRoot(curPath);
  debug(`Nearest project root (w/ 'package.json'): '${rootDir}'`);
  if (!rootDir) {
    showErr(ErrMsg.NO_PACKAGE_JSON);
    return;
  }

  const stack = detectStack(rootDir);
  if (!stack) {
    showErr(ErrMsg.UNSUPPORTED_FRAMEWORK);
    return;
  }

  debug(`Detected stack: "${stack.id}"`);

  const enabledStacks = getConfigVal("enabledStacks");
  if (!enabledStacks.has(stack.id)) {
    showErr(ErrMsg.UNSUPPORTED_FRAMEWORK);
    return;
  }

  const checkExt = checkValidExt(curPath, stack);
  if (!checkExt.ok) {
    showErr(checkExt.error);
    return;
  }

  const res = getTestQuery(curPath, stack, rootDir);
  if (!res.ok) {
    showErr(res.error);
    return;
  }

  let { isFallback, files } = await findFiles(res.value, curPath, true, stack);
  if (files.length === 0) {
    showInfo(InfoMsg.NO_TESTS);
    return;
  }

  const shouldOpen = !isFallback && files.length === 1;

  const autoOpen = getConfigVal("autoOpen");
  const keepSourceOpen = getConfigVal("keepSourceOpen");

  if (shouldOpen && autoOpen) {
    await openFile(files[0].fsPath, keepSourceOpen);
    return;
  } else if (!shouldOpen && !autoOpen) {
    debug(`Info: config.autoOpen is disabled; proceeding to selection`);
    showInfo(InfoMsg.NO_TESTS);
    return;
  }

  if (!getConfigVal("allowFallback")) {
    debug(`Info: config.allowFallback is disabled; skipping fallback search`);
    showInfo(InfoMsg.NO_TESTS);
    return;
  }

  const title = isFallback ? QuickPickTitle.PossibleMatches : QuickPickTitle.MatchesFound;
  const selected = await showFilesQuickPick(files, { title });

  if (selected) await openFile(selected.fsPath, keepSourceOpen);
}

export { main };
