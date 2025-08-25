import * as vscode from "vscode";
import { Config } from "./types.js";

function getUserConfig(): Config {
  return {
    autoOpen: vscode.workspace.getConfiguration("jump2test").get("autoOpen") as boolean,
    allowFallback: vscode.workspace.getConfiguration("jump2test").get("allowFallback") as boolean,
  };
}

export { getUserConfig };
