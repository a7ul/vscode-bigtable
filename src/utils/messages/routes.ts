import { Message } from "../../shared.types";
import { getRows, GetRowsParams } from "../bigtable";
import * as vscode from "vscode";
import { getStoredTable, StoredTableInfo } from "../storage";

/**
 *
 * The router receives messages from the webview
 * The router then processes the message and returns the response payload
 * The response payload is packaged as a response message and sent back to the webiew client
 *
 * @param message: The message received from the client webview
 * @returns payload of the response message
 */
export function createRouter<T extends Record<string, any>>(
  pageContext: T,
  extensionContext: vscode.ExtensionContext
) {
  const router = async (message: Message) => {
    switch (message.route) {
      case "ping": {
        return { pong: true };
      }
      case "context": {
        return pageContext;
      }
      case "getSavedTable": {
        const storedTableId = message.payload?.id as string;
        const storedTableInfo = getStoredTable(extensionContext, storedTableId);
        return storedTableInfo;
      }
      case "createSavedTable": {
        const tableInfo = message.payload as StoredTableInfo;
        const id = await vscode.commands.executeCommand(
          "vscodeBigtable_command_addStoredTable",
          JSON.stringify(tableInfo)
        );
        return { id };
      }
      case "getRows": {
        const { payload } = message as Message<GetRowsParams>;
        const data = await getRows(payload);
        return data.map(({ id, data, key, metadata }) => ({
          id,
          data,
          key,
          metadata,
        }));
      }
      case "showError": {
        const { payload } = message as Message<{ message: string }>;
        vscode.window.showErrorMessage(payload.message);
        return {};
      }
    }
    return null;
  };
  return router;
}
