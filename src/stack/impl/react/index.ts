import { Ok } from "@common/result";
import { Result } from "@common/result/types";
import { EXTS, REACT_ALLOWED_EXTS } from "@impl/react/const";
import { Stack } from "@stack/interface";
import path from "path";

function mkGlob(glob: string, optTestSuffix: boolean = false): string {
  return `**/${glob}{.test,.spec${optTestSuffix ? "," : ""}}{${EXTS}}`;
}

const react: Stack = {
  id: "react",
  deps: ["react", "react-dom", "next", "gatsby", "@remix-run/react", "@vitejs/plugin-react"],
  files: ["next.config.js", "next.config.mjs"],
  exts: REACT_ALLOWED_EXTS,

  getGlob(fPath: string, rootDir: string): Result<string[]> {
    const rel = path.relative(rootDir, fPath);
    const parsed = path.parse(rel);
    const name = parsed.name;
    const dir = path.dirname(rel);
    const parentDir = path.dirname(dir);

    const patterns = [
      mkGlob(`${dir}/${name}`),
      mkGlob(`${dir}/__tests__/${name}`, true),
      ...(parentDir && parentDir !== "." ? [mkGlob(`${parentDir}/__tests__/${name}`, true)] : []),
    ];

    return Ok(patterns);
  },

  getFallbackGlob(fPath: string): string[] {
    const name = path.parse(fPath).name;
    return [mkGlob(name), mkGlob(`__tests__/${name}`, true)];
  },
};

export default react;
