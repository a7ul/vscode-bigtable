import * as vscode from "vscode";
import { GCPBigtableTreeDataProvider } from "./components/gcp-projects-tree-data-provider";
import { StoredTableListTreeDataProvider } from "./components/table-list-tree-data-provider";

import {
  addStoredTable,
  deleteStoredTable,
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
    "vscodeBigtable_views_storedTableList",
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

  const addStoredTableCommand = vscode.commands.registerCommand(
    "vscodeBigtable_command_addStoredTable",
    async (rawConfig: string) => {
      try {
        const tableInfo = JSON.parse(rawConfig) as StoredTableInfo;

        if (
          !tableInfo.id ||
          !tableInfo.clientOptions.projectId ||
          !tableInfo.instanceId ||
          !tableInfo.tableId
        ) {
          throw new Error(`Invalid table config: ${rawConfig}`);
        }

        addStoredTable(context, tableInfo);
        storedTablesProvider.refresh();
        await vscode.commands.executeCommand(
          "vscodeBigtable_command_openTable",
          tableInfo.id
        );
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `Error: Unable to add bigtable. ${err.message}`,
          "Dismiss"
        );
      }
    }
  );

  const deleteStoredTableCommand = vscode.commands.registerCommand(
    "vscodeBigtable_command_deleteStoredTable",
    async ({ id }: { id: string }) => {
      try {
        if (!id) {
          await webviewEngine.createConfigurePanel();
          return;
        }

        deleteStoredTable(context, id);
        storedTablesProvider.refresh();
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `Error: Unable to delete bigtable. ${err.message}`,
          "Dismiss"
        );
      }
    }
  );

  context.subscriptions.push(
    gcpProjectsListTreeview,
    tablesListTreeview,
    addStoredTableCommand,
    deleteStoredTableCommand,
    openTableCommand
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
