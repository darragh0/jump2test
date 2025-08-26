import fs from "fs";
import * as vscode from "vscode";

import { ErrMsg, InfoMsg } from "../common/const";
import { debug } from "../common/logger";
import { detectFramework, findNearestRoot } from "../env/main";
import { QuickPickTitle } from "../ui/const";
import { openFile, showFilesQuickPick } from "../ui/main";
import { showErr, showInfo } from "../ui/user-msg";
import { getUserConfig } from "./config/main";
import { checkValidExt, findFiles, getTestQuery } from "./utils";

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

  const fw = detectFramework(rootDir);
  if (!fw) {
    showErr(ErrMsg.UNSUPPORTED_FRAMEWORK);
    return;
  }

  debug(`Detected framework: "${fw.name}"`);

  const checkExt = checkValidExt(curPath, fw);
  if (!checkExt.ok) {
    showErr(checkExt.error);
    return;
  }

  const res = getTestQuery(curPath, fw, rootDir);
  if (!res.ok) {
    showErr(res.error);
    return;
  }

  let { isFallback, files } = await findFiles(res.value, curPath, true, fw);
  if (files.length === 0) {
    showInfo(InfoMsg.NO_TESTS);
    return;
  }

  const conf = getUserConfig();
  const shouldOpen = !isFallback && files.length === 1;

  if (shouldOpen && conf.autoOpen) {
    await openFile(files[0].fsPath, conf.keepSourceOpen);
    return;
  } else if (!shouldOpen && !conf.autoOpen) {
    debug(`Info: config.autoOpen is disabled; proceeding to selection`);
    showInfo(InfoMsg.NO_TESTS);
    return;
  }

  if (!conf.allowFallback) {
    debug(`Info: config.allowFallback is disabled; skipping fallback search`);
    showInfo(InfoMsg.NO_TESTS);
    return;
  }

  const title = isFallback ? QuickPickTitle.PossibleMatches : QuickPickTitle.MatchesFound;
  const selected = await showFilesQuickPick(files, { title });

  if (selected) await openFile(selected.fsPath, conf.keepSourceOpen);
}

export { main };
