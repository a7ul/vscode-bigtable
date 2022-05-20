import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";
import fetch from "cross-fetch";
import {
  BackendMessageHandler,
  createWebviewMessageQueueBackend,
} from "./messages";
import { createRouter } from "../routes";
import { Table } from "../utils/bigtable";

const DEV = true;

export class WebviewEngine {
  #context: vscode.ExtensionContext;
  #panels: Record<string, vscode.WebviewPanel> = {};

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
  }

  #getWebviewAssetsSrcDir() {
    return path.join(this.#context.extensionPath, "views", "dist");
  }
  async #loadLocalWebviewHtml(view: string) {
    if (DEV) {
      const response = await fetch("http://localhost:6001/" + view);
      return response.text();
    }
    const webviewDir = path.join(this.#getWebviewAssetsSrcDir(), view);
    const htmlDiskPath = vscode.Uri.file(path.join(webviewDir, "index.html"));
    return fs.readFile(htmlDiskPath.path, "utf-8");
  }

  #setupMessageQueue(
    panel: vscode.WebviewPanel,
    router: BackendMessageHandler
  ) {
    const listen = createWebviewMessageQueueBackend(router);
    listen(this.#context, panel);
  }

  #getTableId(table: Table): string {
    const id = `table:${table.bigtable.projectId}/${table.instance.id}/${table.id}`;
    return id;
  }

  async createTablePanel(table: Table) {
    const tableId = this.#getTableId(table);

    if (this.#panels[tableId]) {
      return this.#panels[tableId];
    }
    const type = "TABLE";
    const panel = vscode.window.createWebviewPanel(
      type,
      table.id,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this.#getWebviewAssetsSrcDir())],
      }
    );
    panel.iconPath = vscode.Uri.joinPath(
      this.#context.extensionUri,
      "resources",
      "table.svg"
    );

    const context = {
      projectId: table.bigtable.projectId,
      instanceId: table.instance.id,
      tableId: table.id,
    };
    this.#setupMessageQueue(panel, createRouter(context));
    panel.webview.html = await this.#loadLocalWebviewHtml("query");

    this.#context.subscriptions.push(panel);
    this.#panels[tableId] = panel;

    panel.onDidDispose(
      () => {
        delete this.#panels[tableId];
      },
      undefined,
      this.#context.subscriptions
    );
    return panel;
  }
}
