import fs from "fs";
import path from "path";
import { CommonErr } from "../../common/const";
import { Result } from "../../common/type";
import { EMBER_INDICATORS, EmberErr } from "./const";

/**
 * Strips the `app/` prefix from an Ember.js file path.
 * Prefers a verified Ember app root. If not found, strips
 * the deepest `app/` prefix.
 *
 * @param filePath Path to source file
 */
function stripAppPath(filePath: string): Result<string, CommonErr | EmberErr> {
  const norm = path.resolve(filePath);
  const parts = norm.split(path.sep);

  let deepestAppIdx: number | null = null;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "app") {
      deepestAppIdx = i;
      const projRoot = parts.slice(0, i).join(path.sep);
      const hasIndicator = EMBER_INDICATORS.some((indicator) =>
        fs.existsSync(path.join(projRoot, indicator))
      );

      if (hasIndicator) return { data: parts.slice(i + 1).join(path.sep) };
    }
  }

  if (deepestAppIdx !== null)
    return { data: parts.slice(deepestAppIdx + 1).join(path.sep) };

  if (filePath.endsWith("-test.js") || filePath.endsWith("-test.ts"))
    return { err: EmberErr.ALREADY_TEST };

  return { err: CommonErr.NOT_SUPPORTED };
}

/**
 * Returns the search term for finding test files.
 *
 * @param filePath Path to source file.
 * @returns Search term for finding the test file.
 */
export function getEmberSearchTerm(
  filePath: string
): Result<string, CommonErr | EmberErr> {
  const stripped = stripAppPath(filePath);
  if (stripped.data === undefined) return { err: stripped.err };

  const parts = path.parse(stripped.data);
  if (![".js", ".ts"].includes(parts.ext)) return { err: EmberErr.NOT_JS };

  const query = path.join(parts.dir, `${parts.name}-test`);
  return { data: query };
}
