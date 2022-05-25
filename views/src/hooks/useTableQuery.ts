import type {
  BigtableOptions,
  GetRowsOptions,
  Row,
} from "@google-cloud/bigtable";
import { useState } from "react";
import { client } from "../utils/messages";

export type TableParams = {
  clientOptions: BigtableOptions;
  instanceId: string;
  tableId: string;
};

export type LeanRow = Pick<Row, "id" | "key" | "metadata" | "data">;

export function useTableQuery(params?: TableParams | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rows, setRows] = useState<LeanRow[]>([]);

  async function getRows(options: GetRowsOptions) {
    try {
      setLoading(true);
      if (params) {
        const results = await client.request<LeanRow[]>("getRows", {
          ...params,
          options,
        });
        setRows(results);
      }
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  return { loading, error, rows, getRows };
}
