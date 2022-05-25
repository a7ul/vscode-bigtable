import * as vscode from "vscode";
import { WebviewPanel } from "vscode";
import { Message, MessageType } from "../../shared.types";
export { createRouter } from "./routes";

export type BackendMessageHandler = (
  message: Message
) => Promise<Message["payload"]>;
export function createWebviewMessageQueueBackend(
  handler: BackendMessageHandler
) {
  return function listen(
    context: vscode.ExtensionContext,
    panel: WebviewPanel
  ) {
    panel.webview.onDidReceiveMessage(
      async (message: Message) => {
        try {
          if (message.type !== MessageType.REQUEST) {
            return;
          }
          const result = await handler(message);
          const response: Message = {
            payload: result,
            type: MessageType.RESPONSE,
            requestId: message.requestId,
            route: message.route,
          };
          await panel.webview.postMessage(response);
        } catch (err: any) {
          const response: Message = {
            payload: { message: err?.message, stack: err?.stack, err },
            type: MessageType.ERROR,
            requestId: message?.requestId,
            route: message?.route,
          };
          await panel.webview.postMessage(response);
        }
      },
      undefined,
      context.subscriptions
    );
  };
}
