import { debug } from "../common/logger";
import ember from "./impl/ember";
import react from "./impl/react";
import { Framework } from "./interface";

const frameworks = new Map<string, Framework>([
  [react.name, react],
  [ember.name, ember],
]);
let init = false;

function registerFramework(fw: Framework): void {
  frameworks.set(fw.name, fw);
  debug(`Registered framework: "${fw.name}"`);
}

function getFramework(name: string): Framework | undefined {
  return frameworks.get(name);
}

function getAllFrameworks(): Framework[] {
  if (!init) {
    frameworks.forEach((fw) => registerFramework(fw));
    init = true;
  }
  return Array.from(frameworks.values());
}

export { getAllFrameworks, getFramework, registerFramework };
