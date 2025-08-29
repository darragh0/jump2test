import * as vscode from "vscode";

interface QuickPickFileItem extends vscode.QuickPickItem {
  uri?: vscode.Uri;
}

/** Options for file quick pick display */
interface QuickPickOptions {
  title?: string;
  separatorLabel?: string;
}

export { QuickPickFileItem, QuickPickOptions };
