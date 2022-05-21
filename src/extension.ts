import * as vscode from "vscode";
import { GCPBigtableTreeDataProvider } from "./components/gcp-projects-tree-data-provider";
import { StoredTableListTreeDataProvider } from "./components/table-list-tree-data-provider";

import {
  addStoredTable,
  getStoredTable,
  StoredTableInfo,
} from "./utils/storage";
import { WebviewEngine } from "./utils/webview";

export function activate(context: vscode.ExtensionContext) {
  const webviewEngine = new WebviewEngine(context);

  const gcpProjectsProvider = new GCPBigtableTreeDataProvider(context);
  const storedTablesProvider = new StoredTableListTreeDataProvider(context);

  const gcpProjectsListTreeview = vscode.window.registerTreeDataProvider(
    "vscodeBigtable_views_gcpProjectsList",
    gcpProjectsProvider
  );
  const tablesListTreeview = vscode.window.registerTreeDataProvider(
    "vscodeBigtable_views_addedTableList",
    storedTablesProvider
  );

  const openTableCommand = vscode.commands.registerCommand(
    "vscodeBigtable_command_openTable",
    async (storedTableId) => {
      try {
        if (!storedTableId) {
          await webviewEngine.createConfigurePanel();
          return;
        }

        const tableInfo = getStoredTable(context, storedTableId);
        if (!tableInfo) {
          vscode.window.showErrorMessage(
            `Something went wrong. Table not in your list`
          );
          return;
        }
        await webviewEngine.createTablePanel(tableInfo);
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `Error: Unable to open bigtable view. ${err.message}`,
          "Dismiss"
        );
      }
    }
  );

  const addTableCommand = vscode.commands.registerCommand(
    "vscodeBigtable_command_addTable",
    async (...args) => {
      try {
        const id = args[0];
        const projectId = args[1];
        const instanceId = args[2];
        const tableId = args[3];
        const displayName = args[4];

        if (!id || !projectId || !instanceId || !tableId) {
          await webviewEngine.createConfigurePanel();
          return;
        }

        const tableInfo: StoredTableInfo = {
          id,
          projectId,
          instanceId,
          tableId,
          displayName: displayName || tableId,
        };

        addStoredTable(context, tableInfo);
        storedTablesProvider.refresh();
        await vscode.commands.executeCommand(
          "vscodeBigtable_command_openTable",
          id
        );
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `Error: Unable to add bigtable. ${err.message}`,
          "Dismiss"
        );
      }
    }
  );

  context.subscriptions.push(
    gcpProjectsListTreeview,
    tablesListTreeview,
    addTableCommand,
    openTableCommand
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
