import * as vscode from "vscode";

export const logger = vscode.window.createOutputChannel("Jump to Test", {
  log: true,
});

export function debug(message: string, ...args: unknown[]): void {
  logger.appendLine(`[DEBUG] ${message} ${args.join(" ")}`);
}

export function log(message: string, ...args: unknown[]): void {
  logger.appendLine(`[LOG] ${message} ${args.join(" ")}`);
}
