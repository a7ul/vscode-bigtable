//@ts-ignore
import { Message, MessageType } from "../../../src/shared.types";

import { vscode } from "./vscode";

const TIMEOUT = 1000 * 60 * 3;

class WeviewMessageQueueClient {
  constructor() {
    WeviewMessageQueueClient.subscribe();
  }

  async request<Res extends Record<string, any>>(
    route: Message["route"],
    params: Message["payload"] = {}
  ): Promise<Res> {
    const requestId = window.crypto.randomUUID();
    const message: Message = {
      route: route,
      requestId,
      payload: params,
      type: MessageType.REQUEST,
    };
    const response = this.#createResponseListener<Res>(message);
    vscode.postMessage(message);
    return await response;
  }

  async #createResponseListener<T>(
    message: Pick<Message, "route" | "requestId">
  ): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      // Timeout handler
      const timeoutHandle = setTimeout(() => {
        WeviewMessageQueueClient.#requestTracker.delete(message.requestId);
        reject(new Error(`Timeout for ${message.route} ${message.requestId}`));
      }, TIMEOUT);

      // Handler which will resolve the response
      const handler = (response: Message<T>) => {
        clearTimeout(timeoutHandle);
        WeviewMessageQueueClient.#requestTracker.delete(message.requestId);
        if (response.type === MessageType.ERROR) {
          reject(response);
        } else {
          resolve(response);
        }
      };

      // Store the handler
      WeviewMessageQueueClient.#requestTracker.set(message.requestId, handler);
    });
  }

  static #requestTracker = new Map<
    Message["requestId"],
    (response: Message) => void
  >();

  static subscribe() {
    window.addEventListener("message", (event) => {
      const response: Message = event.data; // The JSON data our extension sent
      if (![MessageType.RESPONSE, MessageType.ERROR].includes(response?.type)) {
        return;
      }
      const handler = WeviewMessageQueueClient.#requestTracker.get(
        response.requestId
      );
      if (!handler) {
        console.warn(`No handler for ${JSON.stringify(response)}`);
        return;
      }
      handler(response);
    });
  }

  debug() {
    console.log(WeviewMessageQueueClient.#requestTracker);
  }
}

export const client = new WeviewMessageQueueClient();
