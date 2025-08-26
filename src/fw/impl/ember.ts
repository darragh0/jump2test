import path from "path";
import { ErrMsg } from "../../common/const.js";
import { Err, Ok } from "../../common/main.js";
import { Result } from "../../common/types.js";
import { showInfo } from "../../ui/user-msg.js";
import { Framework } from "../interface.js";

const EMBER_ALLOWED_EXTS = [".js", ".ts"];

const ember: Framework = {
  name: "Ember",
  deps: ["ember-cli", "ember-source", "ember-data"],
  devDeps: ["ember-cli", "ember-source", "ember-qunit", "ember-mocha"],
  files: ["ember-cli-build.js", ".ember-cli"],
  allowedExts: EMBER_ALLOWED_EXTS,

  getGlob(fPath: string, rootDir: string): Result<string[]> {
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

    const query = path.join(relParts.slice(appIdx + 1, -1).join(path.sep), path.parse(fPath).name);
    const exts = EMBER_ALLOWED_EXTS.join(",");
    return Ok([`**/${query}-test{${exts}}`]);
  },

  getFallbackGlob(fPath: string): string[] {
    const name = path.parse(fPath).name;
    const exts = EMBER_ALLOWED_EXTS.join(",");
    return [`**/${name}-test{${exts}}`];
  },
};

export default ember;
