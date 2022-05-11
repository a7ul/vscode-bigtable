export enum ApiMessageType {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
  ERROR = "ERROR",
}
export type ApiMessage<T extends Record<string, any> = any> = {
  key: string;
  requestId: string;
  type: ApiMessageType;
  extra: T;
};
