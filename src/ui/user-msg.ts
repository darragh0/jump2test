import * as vscode from "vscode";
import { debug, err } from "../common/logger";

function showErr(msg: string): void {
  err(msg);
  void vscode.window.showErrorMessage(msg);
}

function showInfo(msg: string): void {
  debug(`Info: "${msg}"`);
  void vscode.window.showInformationMessage(msg);
}

export { showErr, showInfo };
