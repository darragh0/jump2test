import { Config, StackSet } from "@ext/config/types";
import { StackIdArr } from "@stack/registry/const";
import * as vscode from "vscode";

const CONFIG_DEFAULTS: Config = {
  autoOpen: true,
  allowFallback: true,
  keepSourceOpen: false,
  enabledStacks: new Set(StackIdArr),
};

function getConfigVal(key: "autoOpen"): boolean;
function getConfigVal(key: "allowFallback"): boolean;
function getConfigVal(key: "keepSourceOpen"): boolean;
function getConfigVal(key: "enabledStacks"): StackSet;

function getConfigVal(key: keyof Config): Config[keyof Config] {
  const val = vscode.workspace.getConfiguration("jump2test").get(key, CONFIG_DEFAULTS[key]);

  if (Array.isArray(val)) {
    return new Set(val) as Config[keyof Config];
  }

  return val as Config[keyof Config];
}

export { getConfigVal };
