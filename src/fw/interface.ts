import { Result } from "../common/types";

/** Framework plugin interface for test file detection */
interface Framework {
  /** Unique identifier for the framework */
  name: string;

  /** Package.json dependencies that indicate this framework */
  deps: readonly string[];

  /** Package.json devDependencies that indicate this framework */
  devDeps: readonly string[];

  /** Files in project root that indicate this framework */
  files: readonly string[];

  /** Allowed file extensions for this framework */
  allowedExts: readonly string[];

  /**
   * Get glob pattern for finding test files
   * @param fPath - Absolute path to the source file
   * @param rootDir - Project root directory
   * @returns Glob pattern or error
   */
  getGlob: (fPath: string, rootDir: string) => Result<string[]>;

  /**
   * Get fallback glob pattern for broader search
   * @param fPath - Absolute path to the source file
   * @returns Glob pattern for fallback search
   */
  getFallbackGlob: (fPath: string) => string[];
}

/** Map of framework indicators for detection */
interface FrameworkIndicators {
  deps: readonly string[];
  devDeps: readonly string[];
  files: readonly string[];
}

export { Framework, FrameworkIndicators };
