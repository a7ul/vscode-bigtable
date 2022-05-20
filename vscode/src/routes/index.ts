import { Message } from "../shared.types";
import { getRows } from "../utils/bigtable";

/**
 *
 * The router receives messages from the webview
 * The router then processes the message and returns the response payload
 * The response payload is packaged as a response message and sent back to the webiew client
 *
 * @param message: The message received from the client webview
 * @returns payload of the response message
 */
export const createRouter =
  <T extends Record<string, any>>(context: T) =>
  async (message: Message) => {
    switch (message.route) {
      case "ping": {
        return { pong: true };
      }
      case "context": {
        return context;
      }
      case "getRows": {
        const data = await getRows({
          ...message.payload,
        });
        return data.map((t) => t.id);
      }
    }
    return null;
  };
