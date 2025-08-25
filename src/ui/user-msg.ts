import * as vscode from "vscode";
import { debug } from "../common/logger";

function showErr(msg: string): void {
  debug(`Error: "${msg}"`);
  void vscode.window.showErrorMessage(msg);
}

function showInfo(msg: string): void {
  debug(`Info: "${msg}"`);
  void vscode.window.showInformationMessage(msg);
}

export { showErr, showInfo };
