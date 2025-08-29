import { Result } from "@common/result/types";
import { StackId } from "@stack/types";

/** Stack plugin interface for finding test files */
interface Stack {
  /** Unique ID for the stack */
  id: StackId;

  /** File extensions this stack can process (e.g., [".js", ".ts"]) */
  exts: readonly string[];

  /**
   * Default detection logic (1)
   *
   * Files in project root that indicate this stack
   */
  files?: readonly string[];

  /**
   * Default detection logic (2)
   *
   * `package.json` dependencies (& dev dependencies) that indicate this stack
   */
  deps?: readonly string[];

  /**
   * Custom detection logic
   *
   * If this is defined, and `files` or `deps` ARE NOT, `detection.detectStack`
   * will delegate responsibility to this function.
   *
   * Otherwise, if this is defined, and at least one of `files` or `deps` is ALSO DEFINED,
   * `detection:detectStack` will use the default detection logic (`files` & `deps`),
   * and use this function as a fallback.
   *
   * @param rootDir - Project root directory
   * @return True if the stack is detected, false otherwise
   */
  customDetect?: (rootDir: string) => boolean;

  /**
   * Get glob pattern for finding test files
   *
   * @param fPath - Absolute path to the current source file
   * @param rootDir - Project root directory
   * @return Glob pattern or error
   */
  getGlob: (fPath: string, rootDir: string) => Result<string[]>;

  /**
   * Get fallback glob pattern for broader search
   *
   * @param fPath - Absolute path to the current source file
   * @return Glob pattern for fallback search
   */
  getFallbackGlob?: (fPath: string) => string[];
}

/** Map of stack indicators for detection */
interface StackIndicators {
  deps: readonly string[];
  files: readonly string[];
}

export { Stack, StackIndicators };
