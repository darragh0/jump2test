import * as vscode from "vscode";

export interface QuickPickFileItem extends vscode.QuickPickItem {
  uri?: vscode.Uri;
}

/** Options for file quick pick display */
export interface QuickPickOptions {
  title?: string;
  separatorLabel?: string;
}
