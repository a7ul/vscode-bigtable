import React, { useEffect, useState } from "react";
import { client } from "../utils/messages";
import type { TableParams } from "./useTableQuery";

export type PageContextValue =
  | QueryPageContextValue
  | ConfigurePageContextValue;

export type QueryPageContextValue = {
  page: "query";
  table: TableParams;
};
export type ConfigurePageContextValue = {
  page: "configure";
  storedTableId?: string;
};

export const PageContext = React.createContext<PageContextValue | null>(null);

export function useInitPage() {
  const [context, setContext] = useState<PageContextValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    client
      .request<PageContextValue>("context")
      .then((ctx) => setContext(ctx))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { context, error, loading };
}
