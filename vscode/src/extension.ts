import * as vscode from "vscode";
import { BigtableTreeDataProvider } from "./data/tree-data-provider";
import { WebviewEngine } from "./services/webview";
import { addApiMessageHandler } from "./utils/message";

export function activate(context: vscode.ExtensionContext) {
  const panelEngine = new WebviewEngine(context);

  const projectsListTreeview = vscode.window.registerTreeDataProvider(
    "vscodeBigtable_views_bigtableProjectsList",
    new BigtableTreeDataProvider(context)
  );

  const openTableCommand = vscode.commands.registerCommand(
    "vscodeBigtable_command_openTable",
    async (tableId = "New", title = tableId) => {
      const type = `table:${tableId}`;
      const panel = panelEngine.setupPanel(type, title, vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(panelEngine.getWebviewSrcDir())],
      });
      panel.iconPath = vscode.Uri.joinPath(
        context.extensionUri,
        "resources",
        "table.svg"
      );
      panel.webview.html = await panelEngine.loadLocalWebviewHtml("query");

      addApiMessageHandler(context, panel, async (message) => {
        switch (message.key) {
          case "PING": {
            return { pong: true };
          }
        }
        return null;
      });
    }
  );
  context.subscriptions.push(projectsListTreeview, openTableCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
