import path from "path";
import { Ok } from "../../common/main.js";
import { Result } from "../../common/types.js";
import { Framework } from "../interface.js";

const REACT_ALLOWED_EXTS = [".js", ".ts", ".jsx", ".tsx"];
const EXTS = REACT_ALLOWED_EXTS.join(",");

function mkGlob(glob: string, optTestSuffix: boolean = false): string {
  return `**/${glob}{.test,.spec${optTestSuffix ? "," : ""}}{${EXTS}}`;
}

const react: Framework = {
  name: "React",
  deps: ["react", "react-dom", "next", "gatsby", "@remix-run/react"],
  devDeps: ["react", "react-dom", "@vitejs/plugin-react"],
  files: ["next.config.js", "next.config.mjs"],
  allowedExts: REACT_ALLOWED_EXTS,

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
