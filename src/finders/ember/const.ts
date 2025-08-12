import path from "path";

export const EMBER_INDICATORS = [
  "router.js",
  "app.js",
  path.join("config", "environment.js"),
];

export enum EmberErr {
  NOT_JS = "Not a .ts or .js file >:(",
  ALREADY_TEST = "File seems to be a test file :/",
}
