import * as vscode from "vscode";
import { Config } from "./types";

function getUserConfig(): Config {
  return {
    autoOpen: vscode.workspace.getConfiguration("jump2test").get("autoOpen") as boolean,
    allowFallback: vscode.workspace.getConfiguration("jump2test").get("allowFallback") as boolean,
    keepSourceOpen: vscode.workspace.getConfiguration("jump2test").get("keepSourceOpen") as boolean,
  };
}

export { getUserConfig };
