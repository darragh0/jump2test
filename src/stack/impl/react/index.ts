import { ErrMsg } from "@common/msg/const";
import { Err, Ok } from "@common/result";
import { Result } from "@common/result/types";
import { getConfigVal } from "@ext/config/main";
import { EXTS, REACT_ALLOWED_EXTS } from "@impl/react/const";
import { Stack } from "@stack/interface";
import path from "path";

function isTestFile(name: string): boolean {
  return name.includes(".test.") || name.includes(".spec.");
}

function extractBaseFromTest(name: string): string {
  return name.replace(/\.(test|spec)/, "");
}

function mkGlob(glob: string, optTestSuffix: boolean = false): string {
  return `**/${glob}{.test,.spec${optTestSuffix ? "," : ""}}{${EXTS}}`;
}

function genTestPatterns(fp: string, root: string): string[] {
  const rel = path.relative(root, fp);
  const parsed = path.parse(rel);
  const name = parsed.name;
  const dir = path.dirname(rel);
  const parentDir = path.dirname(dir);

  return [
    mkGlob(`${dir}/${name}`),
    mkGlob(`${dir}/__tests__/${name}`, true),
    ...(parentDir && parentDir !== "." ? [mkGlob(`${parentDir}/__tests__/${name}`, true)] : []),
  ];
}

function genSrcPatterns(fp: string, root: string): string[] {
  const rel = path.relative(root, fp);
  const parsed = path.parse(rel);
  const name = parsed.name;
  const dir = path.dirname(rel);
  
  const base = extractBaseFromTest(name);
  const pats: string[] = [];
  
  // If in __tests__ dir, look in parent
  if (dir.includes("__tests__")) {
    const parentDir = dir.replace(/__tests__\/?/, "");
    pats.push(`${parentDir}/${base}{${EXTS}}`);
    pats.push(`${parentDir}${base}{${EXTS}}`);
  }
  
  // Same directory
  pats.push(`${dir}/${base}{${EXTS}}`);
  
  // Parent directory
  const parentDir = path.dirname(dir);
  if (parentDir && parentDir !== ".") {
    pats.push(`${parentDir}/${base}{${EXTS}}`);
  }
  
  // Common source locations
  pats.push(
    `src/${base}{${EXTS}}`,
    `src/**/${base}{${EXTS}}`,
    `lib/${base}{${EXTS}}`,
    `components/${base}{${EXTS}}`,
    `**/${base}{${EXTS}}`
  );
  
  return pats;
}

const react: Stack = {
  id: "react",
  deps: ["react", "react-dom", "next", "gatsby", "@remix-run/react", "@vitejs/plugin-react"],
  files: ["next.config.js", "next.config.mjs"],
  exts: REACT_ALLOWED_EXTS,

  getGlob(fp: string, root: string): Result<string[]> {
    const rel = path.relative(root, fp);
    const parsed = path.parse(rel);
    const name = parsed.name;
    const dir = path.dirname(rel);

    if (isTestFile(name) || dir.includes("__tests__") || dir.includes("__test__")) {
      if (getConfigVal("jumpToSourceBeta")) {
        const pats = genSrcPatterns(fp, root);
        return Ok(Array.from(new Set(pats)));
      }
      return Err(ErrMsg.ALREADY_IN_TEST);
    }

    const pats = genTestPatterns(fp, root);
    return Ok(pats);
  },

  getFallbackGlob(fp: string): string[] {
    const name = path.parse(fp).name;
    const isTest = isTestFile(name);
    const base = isTest ? extractBaseFromTest(name) : name;

    if (isTest && getConfigVal("jumpToSourceBeta")) {
      return [
        `**/${base}{${EXTS}}`,
        `src/**/${base}{${EXTS}}`,
        `lib/**/${base}{${EXTS}}`,
      ];
    }

    return [mkGlob(base), mkGlob(`__tests__/${base}`, true)];
  },
};

export default react;