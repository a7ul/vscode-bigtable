export enum MessageType {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
  ERROR = "ERROR",
}
export type Message<T extends Record<string, any> = any> = {
  route: string;
  requestId: string;
  type: MessageType;
  payload: T;
};
