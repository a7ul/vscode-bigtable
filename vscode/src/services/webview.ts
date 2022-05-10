import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";
import fetch from "cross-fetch";

const DEV = true;

export class WebviewEngine {
  context: vscode.ExtensionContext;
  panels: Record<string, vscode.WebviewPanel> = {};
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }
  #createNewPanel(
    ...params: Parameters<typeof vscode.window.createWebviewPanel>
  ) {
    const viewType = params[0];
    const panel = vscode.window.createWebviewPanel(...params);
    this.context.subscriptions.push(panel);
    this.panels[viewType] = panel;

    panel.onDidDispose(
      () => {
        delete this.panels[viewType];
      },
      undefined,
      this.context.subscriptions
    );
    return panel;
  }
  setupPanel(
    ...params: Parameters<typeof vscode.window.createWebviewPanel>
  ): vscode.WebviewPanel {
    const viewType = params[0];
    if (this.panels[viewType]) {
      return this.panels[viewType];
    }
    return this.#createNewPanel(...params);
  }

  getWebviewSrcDir() {
    return path.join(this.context.extensionPath, "views", "dist");
  }
  async loadLocalWebviewHtml(view: string) {
    if (DEV) {
      const response = await fetch("http://localhost:6001/" + view);
      return response.text();
    }
    const webviewDir = path.join(this.getWebviewSrcDir(), view);
    const htmlDiskPath = vscode.Uri.file(path.join(webviewDir, "index.html"));
    return fs.readFile(htmlDiskPath.path, "utf-8");
  }
}
