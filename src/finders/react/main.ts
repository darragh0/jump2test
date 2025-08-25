import path from "path";
import { Ok } from "../../common/main.js";
import { Result } from "../../common/types.js";
import { REACT_ALLOWED_EXTS } from "./const.js";

/** Return a glob-ready search term for common React test file conventions */
function getReactGlob(fPath: string, rootDir: string): Result<string> {
  const rel = path.relative(rootDir, fPath);
  const parsed = path.parse(rel);
  const name = parsed.name;
  const dir = path.dirname(rel);
  const parentDir = path.dirname(dir);

  const exts = REACT_ALLOWED_EXTS.join(",");

  const patterns = [
    // 1. Suffix-based (co-located): test files in same directory
    `${dir}/${name}.{test,spec}{${exts}}`,

    // 2. Directory-based (co-located): test files in __tests__ folder in same directory
    `${dir}/__tests__/${name}.{test,spec}{${exts}}`,
    `${dir}/__tests__/${name}{${exts}}`,

    // 3. Parent directory __tests__
    ...(parentDir && parentDir !== "."
      ? [
          `${parentDir}/__tests__/${name}.{test,spec}{${exts}}`,
          `${parentDir}/__tests__/${name}{${exts}}`,
        ]
      : []),
  ];

  return Ok(`{${patterns.join(",")}}`);
}

function getReactFallbackGlob(fPath: string): string {
  const name = path.parse(fPath).name;
  const exts = REACT_ALLOWED_EXTS.join(",");

  const patterns = [
    // Suffix-based patterns anywhere
    `**/${name}.{test,spec}{${exts}}`,

    // Directory-based patterns anywhere
    `**/__tests__/${name}.{test,spec}{${exts}}`,
    `**/__tests__/${name}{${exts}}`,
  ];

  return `{${patterns.join(",")}}`;
}

export { getReactFallbackGlob, getReactGlob };
