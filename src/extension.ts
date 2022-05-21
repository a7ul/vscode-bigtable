import * as vscode from "vscode";
import { BigtableTreeDataProvider } from "./components/tree-data-provider";
import { getTable } from "./utils/bigtable";
import { WebviewEngine } from "./utils/webview";

export function activate(context: vscode.ExtensionContext) {
  const webviewEngine = new WebviewEngine(context);

  const projectsListTreeview = vscode.window.registerTreeDataProvider(
    "vscodeBigtable_views_bigtableProjectsList",
    new BigtableTreeDataProvider(context)
  );

  const openTableCommand = vscode.commands.registerCommand(
    "vscodeBigtable_command_openTable",
    async (...args) => {
      try {
        const projectId = args[0];
        const instanceId = args[1];
        const tableId = args[2];

        if (!projectId || !instanceId || !tableId) {
          await webviewEngine.createConfigurePanel();
          return;
        }

        const tableInfo = { projectId, instanceId, tableId };
        const table = await getTable(tableInfo);
        await webviewEngine.createTablePanel(table);
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `Error: Unable to open bigtable view. ${err.message}`,
          "Dismiss"
        );
      }
    }
  );
  context.subscriptions.push(projectsListTreeview, openTableCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
