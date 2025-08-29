import { trace } from "@common/logging";
import { MAX_ROOT_DIR_ITERATIONS } from "@stack/const";
import { Stack } from "@stack/interface";
import { getAllStacks } from "@stack/registry";
import { PackageJson } from "@stack/types";
import fs from "fs";
import path from "path";

function readPackageJson(rootDir: string): PackageJson | null {
  try {
    const raw = fs.readFileSync(path.join(rootDir, "package.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Return `true` if dependency map contains any keys */
function hasAny(deps: Record<string, unknown> | undefined, keys?: readonly string[]): boolean {
  if (!deps || !keys) return false;
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

const stackCache = new Map<string, Stack | null>();

function detectStack(rootDir: string): Stack | null {
  const cached = stackCache.get(rootDir);
  if (cached) return cached;

  const pkg = readPackageJson(rootDir);
  const deps = pkg?.dependencies ?? {};
  const devDeps = pkg?.devDependencies ?? {};

  const retStack = (stack: Stack) => {
    stackCache.set(rootDir, stack);
    return stack;
  };

  for (const stack of getAllStacks()) {
    if (stack.files || stack.deps) {
      trace(`Using default detection for stack: "${stack.id}"`);
      const hasFiles = stack.files?.some((file: string) => fs.existsSync(path.join(rootDir, file)));
      const hasDeps = hasAny(deps, stack.deps) || hasAny(devDeps, stack.deps);

      if (hasFiles && !hasDeps) return retStack(stack);
    }

    if (stack.customDetect) {
      trace(`Using custom detection for stack: "${stack.id}"`);
      if (stack.customDetect(rootDir)) return retStack(stack);
    }
  }

  stackCache.set(rootDir, null);
  return null;
}

export { detectStack, findNearestRoot };
