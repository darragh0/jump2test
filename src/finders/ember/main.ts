import path from "path";
import { ErrMsg } from "../../common/const.js";
import { Err, Ok } from "../../common/main.js";
import { Result } from "../../common/types.js";
import { showInfo } from "../../ui/user-msg.js";
import { EMBER_ALLOWED_EXTS } from "./const.js";

function getEmberGlobSuff(query: string): string {
  return `${query}-test{${EMBER_ALLOWED_EXTS.join(",")}}`;
}

/** Build the Ember test search term for a source file */
function getEmberGlob(fPath: string, rootDir: string): Result<string> {
  const endsWithTest = fPath.endsWith("-test.js") || fPath.endsWith("-test.ts");

  const rel = path.relative(rootDir, fPath);
  const relParts = rel.split(path.sep);
  const appIdx = relParts.findIndex((segment) => segment === "app");

  if (appIdx === -1) {
    const testIdx = relParts.findIndex((segment) => segment === "tests");
    if (testIdx === -1 && endsWithTest) return Err(ErrMsg.MAYBE_ALREADY_IN_TEST);
    else if (endsWithTest) return Err(ErrMsg.ALREADY_IN_TEST);

    return Err(ErrMsg.MISSING_EMBER_APP);
  }

  if (endsWithTest) showInfo(ErrMsg.MAYBE_TEST_IN_APP_DIR);

  // hmm im erroneously getting this: "**/tests/{unit,integration,acceptance}/services/notifications-service.js-test{.js,
  // fix this pls copilot:

  const query = path.join(relParts.slice(appIdx + 1, -1).join(path.sep), path.parse(fPath).name);
  return Ok(`**/tests/{unit,integration,acceptance}/${getEmberGlobSuff(query)}`);
}

function getEmberFallbackGlob(fPath: string): string {
  return `**/${getEmberGlobSuff(path.parse(fPath).name)}`;
}

export { getEmberFallbackGlob, getEmberGlob };
