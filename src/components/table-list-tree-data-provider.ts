import * as vscode from "vscode";

import { getStoredTableList, StoredTableInfo } from "../utils/storage";

export class StoredTableListTreeDataProvider
  implements vscode.TreeDataProvider<TableTreeItem>
{
  context: vscode.ExtensionContext;
  private _onDidChangeTreeData: vscode.EventEmitter<
    TableTreeItem | undefined | null | void
  > = new vscode.EventEmitter<TableTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TableTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getTreeItem(element: TableTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TableTreeItem): Promise<TableTreeItem[]> {
    if (!element) {
      const tables = getStoredTableList(this.context);
      return tables.map((table) => new TableTreeItem(this.context, table));
    }
    return element.getChildren();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class TableTreeItem extends vscode.TreeItem {
  context: vscode.ExtensionContext;
  tableInfo: StoredTableInfo;

  constructor(context: vscode.ExtensionContext, tableInfo: StoredTableInfo) {
    super(tableInfo.displayName, vscode.TreeItemCollapsibleState.None);
    this.tableInfo = tableInfo;
    this.context = context;

    this.id = this.tableInfo.id;
    this.iconPath = vscode.Uri.joinPath(this.resourceUri, "table.svg");
    this.tooltip = this.tableInfo.displayName ?? undefined;
    this.description = this.tableInfo.id;
    this.command = {
      title: "Open Bigtable Table",
      command: "vscodeBigtable_command_openTable",
      arguments: [this.tableInfo.id],
    };
  }

  async getChildren(): Promise<TableTreeItem[]> {
    return [];
  }

  // @ts-ignore
  get resourceUri() {
    return vscode.Uri.joinPath(this.context.extensionUri, "resources");
  }
}
