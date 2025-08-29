import { ErrMsg } from "@common/msg/const";
import { Err, Ok } from "@common/result";
import { Result } from "@common/result/types";
import { showInfo } from "@common/ui";
import { getConfigVal } from "@ext/config/main";
import { EMBER_ALLOWED_EXTS } from "@impl/ember/const";
import { Stack } from "@stack/interface";
import path from "path";

function genTestPatterns(fp: string, root: string): string[] {
  const rel = path.relative(root, fp);
  const relParts = rel.split(path.sep);
  const appIdx = relParts.findIndex((segment) => segment === "app");
  
  if (appIdx === -1) return [];
  
  const query = path.join(relParts.slice(appIdx + 1, -1).join(path.sep), path.parse(fp).name);
  const exts = EMBER_ALLOWED_EXTS.join(",");
  return [`**/${query}-test{${exts}}`];
}

function genSrcPatterns(fp: string, root: string): string[] {
  const rel = path.relative(root, fp);
  const parsed = path.parse(rel);
  const name = parsed.name;
  
  // Remove -test suffix
  const base = name.replace(/-test$/, "");
  const pats: string[] = [];
  
  // Map from tests/ structure to app/ structure
  const testPath = rel.replace(/\\/g, "/");
  
  if (testPath.includes("tests/unit/")) {
    const appPath = testPath.replace("tests/unit/", "app/").replace(/-test\.(js|ts)$/, ".$1");
    pats.push(appPath);
  }
  
  if (testPath.includes("tests/integration/")) {
    const appPath = testPath.replace("tests/integration/", "app/").replace(/-test\.(js|ts)$/, ".$1");
    pats.push(appPath);
  }
  
  if (testPath.includes("tests/acceptance/")) {
    // Acceptance tests don't map 1:1, search broadly
    pats.push(`app/**/${base}.{js,ts}`);
  }
  
  // Fallback patterns
  pats.push(
    `app/**/${base}.{js,ts}`,
    `addon/**/${base}.{js,ts}`,
    `lib/**/${base}.{js,ts}`,
    `**/${base}.{js,ts}`
  );
  
  return pats;
}

const ember: Stack = {
  id: "ember",
  deps: ["ember-cli", "ember-source", "ember-data", "ember-qunit", "ember-mocha"],
  files: ["ember-cli-build.js", ".ember-cli"],
  exts: EMBER_ALLOWED_EXTS,

  getGlob(fp: string, root: string): Result<string[]> {
    const endsWithTest = fp.endsWith("-test.js") || fp.endsWith("-test.ts");

    const rel = path.relative(root, fp);
    const relParts = rel.split(path.sep);
    const appIdx = relParts.findIndex((segment) => segment === "app");
    const testIdx = relParts.findIndex((segment) => segment === "tests");

    // Check if we're in a test file
    if (testIdx !== -1 || endsWithTest) {
      if (getConfigVal("jumpToSourceBeta")) {
        const pats = genSrcPatterns(fp, root);
        return Ok(Array.from(new Set(pats)));
      }
      
      if (testIdx === -1 && endsWithTest) return Err(ErrMsg.MAYBE_ALREADY_IN_TEST);
      if (testIdx !== -1) return Err(ErrMsg.ALREADY_IN_TEST);
      return Err(ErrMsg.ALREADY_IN_TEST);
    }

    if (appIdx === -1) {
      return Err(ErrMsg.MISSING_EMBER_APP);
    }

    if (endsWithTest) showInfo(ErrMsg.MAYBE_TEST_IN_APP_DIR);

    const pats = genTestPatterns(fp, root);
    return Ok(pats);
  },

  getFallbackGlob(fp: string): string[] {
    const name = path.parse(fp).name;
    const isTest = fp.endsWith("-test.js") || fp.endsWith("-test.ts");
    const base = isTest ? name.replace(/-test$/, "") : name;
    const exts = EMBER_ALLOWED_EXTS.join(",");

    if (isTest && getConfigVal("jumpToSourceBeta")) {
      return [
        `app/**/${base}{${exts}}`,
        `addon/**/${base}{${exts}}`,
        `**/${base}{${exts}}`,
      ];
    }

    return [`**/${base}-test{${exts}}`];
  },
};

export default ember;