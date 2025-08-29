import { debug } from "@common/logging";
import { ErrMsg } from "@common/msg/const";
import { Err, Ok } from "@common/result";
import { Result } from "@common/result/types";
import { Stack } from "@stack/interface";
import * as path from "path";
import * as vscode from "vscode";
import { ExcludePatterns } from "./types";

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

function checkValidExt(fPath: string, stack: Stack): Result<undefined> {
  const ext = path.extname(fPath);
  debug(`Checking file extension: "${ext}"`);

  return stack.exts.includes(ext)
    ? Ok(undefined)
    : Err(`${ErrMsg.UNSUPPORTED_FILE} (only ${stack.exts.join(", ")})`);
}

async function findFiles(
  glob: string[],
  curPath: string,
  allowFallback: boolean,
  stack: Stack
): Promise<{ isFallback: boolean; files: vscode.Uri[] }> {
  const exclude = await getExcludeGlob();
  debug(`Looking for pattern(s): "${glob.join(", ")}"`);

  let files = await Promise.all(glob.map((g) => vscode.workspace.findFiles(g, exclude)))
    .then((results) => results.flat())
    .then((files) => files.filter((f) => f.fsPath !== curPath));

  debug(`Found ${files.length} related test files`);

  let isFallback = false;
  if (allowFallback && files.length === 0) {
    const fbGlob = stack.getFallbackGlob?.(curPath);
    if (fbGlob) {
      isFallback = true;

      debug(`No matches; retrying with fallback pattern(s): "${fbGlob.join(", ")}"`);

      files = await Promise.all(fbGlob.map((glob) => vscode.workspace.findFiles(glob, exclude)))
        .then((results) => results.flat())
        .then((files) => files.filter((f) => f.fsPath !== curPath));

      debug(`Found ${files.length} related test files`);
    }
  }

  return { isFallback, files };
}

function getTestQuery(fPath: string, stack: Stack, rootDir: string): Result<string[]> {
  if (!fPath || fPath.trim() === "") return Err(ErrMsg.INVALID_FILE);
  return stack.getGlob(fPath, rootDir);
}

export { checkValidExt, findFiles, getTestQuery };
