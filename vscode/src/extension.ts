import * as vscode from "vscode";
import { BigtableTreeDataProvider } from "./data/tree-data-provider";

export function activate(context: vscode.ExtensionContext) {
  const debugMessage = vscode.commands.registerCommand(
    "vscodeBigtable_command_openTable",
    function (args) {
      // This is a command to execute
      const date = new Date();
      vscode.window.showInformationMessage(
        "Debug called at " + date.toLocaleString()
      );
    }
  );

  // Active tree view
  const treeview = vscode.window.registerTreeDataProvider(
    "vscodeBigtable_views_bigtableProjectsList",
    new BigtableTreeDataProvider(context)
  );

  context.subscriptions.push(treeview, debugMessage);
}

// this method is called when your extension is deactivated
export function deactivate() {}
