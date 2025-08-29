import { StackIdArr } from "@stack/registry/const";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  name?: string;
  [key: string]: unknown;
}

type StackId = (typeof StackIdArr)[number];

export { PackageJson, StackId };
