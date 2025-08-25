interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  name?: string;
  [key: string]: unknown;
}

interface FwIndicatorMap {
  deps: readonly string[];
  devDeps: readonly string[];
  files: readonly string[];
}

export { FwIndicatorMap, PackageJson };
