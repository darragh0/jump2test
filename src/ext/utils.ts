import * as path from "path";
import * as vscode from "vscode";
import { ErrMsg } from "../common/const.js";
import { debug } from "../common/logger.js";
import { Err, Ok } from "../common/main.js";
import { Result } from "../common/types.js";
import { Framework } from "../env/const.js";
import { EMBER_ALLOWED_EXTS } from "../finders/ember/const.js";
import { getEmberFallbackGlob, getEmberGlob } from "../finders/ember/main.js";
import { REACT_ALLOWED_EXTS } from "../finders/react/const.js";
import { getReactFallbackGlob, getReactGlob } from "../finders/react/main.js";
import { ExcludePatterns } from "./types.js";

async function getExcludeGlob(): Promise<vscode.GlobPattern> {
  const globalExclude = vscode.workspace.getConfiguration("files.exclude") as ExcludePatterns;
  const localExclude: ExcludePatterns = {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/out/**": true,
    "**/.git/**": true,
  };

  return Object.keys({
    ...localExclude,
    ...globalExclude,
  }).join(",");
}

async function checkValidExt(fPath: string, fw: Framework): Promise<Result<undefined>> {
  const exts = fw === Framework.Ember ? EMBER_ALLOWED_EXTS : REACT_ALLOWED_EXTS;
  const ext = path.extname(fPath);
  debug(`Checking file extension: "${ext}"`);

  return exts.includes(ext)
    ? Ok(undefined)
    : Err(`${ErrMsg.UNSUPPORTED_FILE} (only ${exts.join(", ")})`);
}

async function getFallbackGlob(fPath: string, fw: Framework): Promise<string> {
  switch (fw) {
    case Framework.Ember:
      return getEmberFallbackGlob(fPath);
    case Framework.React:
      return getReactFallbackGlob(fPath);
  }
}

async function findFiles(
  glob: string,
  curPath: string,
  allowFallback: boolean,
  fw: Framework
): Promise<{ isFallback: boolean; files: vscode.Uri[] }> {
  const exclude = await getExcludeGlob();
  debug(`Looking for pattern: "${glob}"`);

  let files = await vscode.workspace.findFiles(glob, exclude);
  files = files.filter((f) => f.fsPath !== curPath);
  debug(`Found ${files.length} related test files`);

  let isFallback = false;
  if (allowFallback && files.length === 0) {
    const fbGlob = await getFallbackGlob(path.parse(curPath).name, fw);
    isFallback = true;

    debug(`No matches; retrying with fallback pattern: "${fbGlob}"`);
    files = await vscode.workspace.findFiles(fbGlob, exclude);
    files = files.filter((f) => f.fsPath !== curPath);
    debug(`Found ${files.length} related test files`);
  }

  return { isFallback, files };
}

function getTestQuery(fPath: string, fw: Framework, rootDir: string): Result<string> {
  if (!fPath || fPath.trim() === "") return Err(ErrMsg.INVALID_FILE);

  if (fw === Framework.Ember) return getEmberGlob(fPath, rootDir);
  if (fw === Framework.React) return getReactGlob(fPath, rootDir);

  return Err(ErrMsg.UNSUPPORTED_FRAMEWORK);
}

export { checkValidExt, findFiles, getTestQuery };
