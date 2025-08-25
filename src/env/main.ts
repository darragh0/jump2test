import fs from "fs";
import path from "path";
import { Framework, FwIndicators, MAX_ROOT_DIR_ITERATIONS } from "./const.js";
import { PackageJson } from "./types.js";

function readPackageJson(rootDir: string): PackageJson | null {
  try {
    const raw = fs.readFileSync(path.join(rootDir, "package.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Return `true` if dependency map contains any keys */
function hasAny(deps: Record<string, unknown> | undefined, keys: readonly string[]): boolean {
  if (!deps) return false;
  return keys.some((k) => Object.prototype.hasOwnProperty.call(deps, k));
}

/** Find nearest root directory walking up from a path */
function findNearestRoot(startPath: string): string | null {
  let current = path.resolve(startPath);
  if (fs.existsSync(current) && fs.statSync(current).isFile()) {
    current = path.dirname(current);
  }

  for (let i = 0; i < MAX_ROOT_DIR_ITERATIONS; i++) {
    if (fs.existsSync(path.join(current, "package.json"))) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

/** Framework detection cache */
const fwCache = new Map<string, Framework | null>();

/** Detect framework by inspecting nearest `package.json` & indicators (memoized) */
function detectFramework(rootDir: string): Framework | null {
  const cached = fwCache.get(rootDir);
  if (cached) return cached;

  const pkg = readPackageJson(rootDir);
  const deps = pkg?.dependencies ?? {};
  const devDeps = pkg?.devDependencies ?? {};

  for (const [fwName, indicators] of Object.entries(FwIndicators)) {
    const fw = fwName as Framework;
    const hasFiles = indicators.files.some((file) => fs.existsSync(path.join(rootDir, file)));

    if (hasAny(deps, indicators.deps) || hasAny(devDeps, indicators.devDeps) || hasFiles) {
      fwCache.set(rootDir, fw);
      return fw;
    }
  }

  fwCache.set(rootDir, null);
  return null;
}

export { detectFramework, findNearestRoot };
