import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";
import fetch from "cross-fetch";
import {
  BackendMessageHandler,
  createWebviewMessageQueueBackend,
} from "./messages";
import { StoredTableInfo } from "./storage";
import { createRouter } from "./messages/routes";

export class WebviewEngine {
  context: vscode.ExtensionContext;
  panels: Record<string, vscode.WebviewPanel> = {};

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async loadLocalWebviewHtml() {
    if (this.context.extensionMode === vscode.ExtensionMode.Development) {
      // Running in development mode
      const response = await fetch("http://localhost:6001/index.html");
      const html = await response.text();
      return html;
    }
    // Running in test || production mode
    const htmlDiskPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "resources", "index.html")
    );
    return fs.readFile(htmlDiskPath.path, "utf-8");
  }

  setupMessageQueue(panel: vscode.WebviewPanel, router: BackendMessageHandler) {
    const listen = createWebviewMessageQueueBackend(router);
    listen(this.context, panel);
  }

  async createTablePanel(tableInfo: StoredTableInfo) {
    if (this.panels[tableInfo.id]) {
      return this.panels[tableInfo.id];
    }

    const panel = vscode.window.createWebviewPanel(
      "TABLE",
      tableInfo.displayName,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.resolve(this.context.extensionPath, "views")),
        ],
      }
    );
    panel.iconPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      "resources",
      "table.svg"
    );

    const pageContext = {
      page: "query",
      table: tableInfo,
    };
    this.setupMessageQueue(panel, createRouter(pageContext));
    panel.webview.html = await this.loadLocalWebviewHtml();

    this.context.subscriptions.push(panel);
    this.panels[tableInfo.id] = panel;

    panel.onDidDispose(
      () => {
        delete this.panels[tableInfo.id];
      },
      undefined,
      this.context.subscriptions
    );
    return panel;
  }

  async createConfigurePanel(storedTableId: string | undefined) {
    const panelId = "configure:view";

    if (this.panels[panelId]) {
      return this.panels[panelId];
    }

    const panel = vscode.window.createWebviewPanel(
      "CONFIGURE",
      "Bigtable",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.resolve(this.context.extensionPath, "views")),
        ],
      }
    );

    panel.iconPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      "resources",
      "setting.svg"
    );

    const context = { page: "configure", storedTableId };
    this.setupMessageQueue(panel, createRouter(context));
    panel.webview.html = await this.loadLocalWebviewHtml();

    this.context.subscriptions.push(panel);
    this.panels[panelId] = panel;

    panel.onDidDispose(
      () => {
        delete this.panels[panelId];
      },
      undefined,
      this.context.subscriptions
    );
    return panel;
  }
}
