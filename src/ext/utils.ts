import * as path from "path";
import * as vscode from "vscode";
import { ErrMsg } from "../common/const.js";
import { debug } from "../common/logger.js";
import { Err, Ok } from "../common/main.js";
import { Result } from "../common/types.js";
import { Framework } from "../fw/interface.js";
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

function checkValidExt(fPath: string, fw: Framework): Result<undefined> {
  const ext = path.extname(fPath);
  debug(`Checking file extension: "${ext}"`);

  return fw.allowedExts.includes(ext)
    ? Ok(undefined)
    : Err(`${ErrMsg.UNSUPPORTED_FILE} (only ${fw.allowedExts.join(", ")})`);
}

async function findFiles(
  glob: string[],
  curPath: string,
  allowFallback: boolean,
  fw: Framework
): Promise<{ isFallback: boolean; files: vscode.Uri[] }> {
  const exclude = await getExcludeGlob();
  debug(`Looking for pattern(s): "${glob.join(", ")}"`);

  let files = await Promise.all(glob.map((g) => vscode.workspace.findFiles(g, exclude)))
    .then((results) => results.flat())
    .then((files) => files.filter((f) => f.fsPath !== curPath));

  debug(`Found ${files.length} related test files`);

  let isFallback = false;
  if (allowFallback && files.length === 0) {
    const fbGlob = fw.getFallbackGlob(curPath);
    isFallback = true;

    debug(`No matches; retrying with fallback pattern(s): "${fbGlob.join(", ")}"`);

    files = await Promise.all(fbGlob.map((glob) => vscode.workspace.findFiles(glob, exclude)))
      .then((results) => results.flat())
      .then((files) => files.filter((f) => f.fsPath !== curPath));

    debug(`Found ${files.length} related test files`);
  }

  return { isFallback, files };
}

function getTestQuery(fPath: string, fw: Framework, rootDir: string): Result<string[]> {
  if (!fPath || fPath.trim() === "") return Err(ErrMsg.INVALID_FILE);
  return fw.getGlob(fPath, rootDir);
}

export { checkValidExt, findFiles, getTestQuery };
