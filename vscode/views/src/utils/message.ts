//@ts-ignore
import { ApiMessage, ApiMessageType } from "../../../src/shared.types";

import { vscode } from "./vscode";

const TIMEOUT = 1000 * 60 * 3;

class MessageQueue {
  constructor() {
    MessageQueue.subscribe();
  }

  async request<Res extends Record<string, any>>(
    key: ApiMessage["key"],
    params: ApiMessage["extra"] = {}
  ): Promise<Res> {
    const requestId = window.crypto.randomUUID();
    const message: ApiMessage = {
      key,
      requestId,
      extra: params,
      type: ApiMessageType.REQUEST,
    };
    const response = this.#createResponseListener<Res>(message);
    vscode.postMessage(message);
    return await response;
  }

  async #createResponseListener<T>(
    message: Pick<ApiMessage, "key" | "requestId">
  ): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      // Timeout handler
      const timeoutHandle = setTimeout(() => {
        MessageQueue.#requestTracker.delete(message.requestId);
        reject(new Error(`Timeout for ${message.key} ${message.requestId}`));
      }, TIMEOUT);

      // Handler which will resolve the response
      const handler = (response: ApiMessage<T>) => {
        clearTimeout(timeoutHandle);
        MessageQueue.#requestTracker.delete(message.requestId);
        if (response.type === ApiMessageType.ERROR) {
          reject(response);
        } else {
          resolve(response);
        }
      };

      // Store the handler
      MessageQueue.#requestTracker.set(message.requestId, handler);
    });
  }

  static #requestTracker = new Map<
    ApiMessage["requestId"],
    (response: ApiMessage) => void
  >();

  static subscribe() {
    window.addEventListener("message", (event) => {
      const response: ApiMessage = event.data; // The JSON data our extension sent
      if (
        ![ApiMessageType.RESPONSE, ApiMessageType.ERROR].includes(
          response?.type
        )
      ) {
        return;
      }
      const handler = MessageQueue.#requestTracker.get(response.requestId);
      if (!handler) {
        console.warn(`No handler for ${JSON.stringify(response)}`);
        return;
      }
      handler(response);
    });
  }

  debug() {
    console.log(MessageQueue.#requestTracker);
  }
}

export const api = new MessageQueue();
