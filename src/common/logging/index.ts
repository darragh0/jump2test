import * as vscode from "vscode";

/** Shared output channel for diagnostic & informational logs */
const logger = vscode.window.createOutputChannel("Jump to Test", { log: true });

function trace(message: string, ...args: readonly unknown[]): void {
  logger.trace(`${message} ${args.join(" ")}`);
}

function debug(message: string, ...args: readonly unknown[]): void {
  logger.debug(`${message} ${args.join(" ")}`);
}

function info(message: string, ...args: readonly unknown[]): void {
  logger.info(`${message} ${args.join(" ")}`);
}

function warn(message: string, ...args: readonly unknown[]): void {
  logger.warn(`${message} ${args.join(" ")}`);
}

function err(message: string, ...args: readonly unknown[]): void {
  logger.error(`${message} ${args.join(" ")}`);
}

export { debug, err, info, trace, warn };
