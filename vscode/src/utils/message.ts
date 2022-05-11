import * as vscode from "vscode";
import { WebviewPanel } from "vscode";
import { ApiMessage, ApiMessageType } from "../shared.types";

export function addApiMessageHandler(
  context: vscode.ExtensionContext,
  panel: WebviewPanel,
  handler: (message: ApiMessage) => Promise<ApiMessage["extra"]>
) {
  panel.webview.onDidReceiveMessage(
    async (message: ApiMessage) => {
      try {
        if (message.type !== ApiMessageType.REQUEST) {
          return;
        }
        const result = await handler(message);
        const response: ApiMessage = {
          extra: result,
          type: ApiMessageType.RESPONSE,
          requestId: message.requestId,
          key: message.key,
        };
        await panel.webview.postMessage(response);
      } catch (err: any) {
        const response: ApiMessage = {
          extra: { message: err?.message, stack: err?.stack, err },
          type: ApiMessageType.ERROR,
          requestId: message?.requestId,
          key: message?.key,
        };
        await panel.webview.postMessage(response);
      }
    },
    undefined,
    context.subscriptions
  );
}
