import * as vscode from "vscode";

/** Shared output channel for diagnostic & informational logs */
const logger = vscode.window.createOutputChannel("Jump to Test", {
  log: true,
});

/** Write a debug message to the output channel */
function debug(message: string, ...args: readonly unknown[]): void {
  logger.appendLine(`[DEBUG] ${message} ${args.join(" ")}`);
}

/** Write a general log message to the output channel */
function log(message: string, ...args: readonly unknown[]): void {
  logger.appendLine(`[LOG] ${message} ${args.join(" ")}`);
}

export { debug, log };
