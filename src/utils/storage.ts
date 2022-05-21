import { ExtensionContext } from "vscode";
import { TableInfo } from "./bigtable";

export type StoredTableInfo = TableInfo & {
  id: string;
  displayName: string;
};
/**
 * Get table list from vscode storage.
 */
export function getStoredTableList(
  context: ExtensionContext
): StoredTableInfo[] {
  const tableList =
    context.globalState.get<StoredTableInfo[]>("tableList") ?? [];
  return tableList;
}

export function getStoredTable(
  context: ExtensionContext,
  id: string
): StoredTableInfo | undefined {
  const tableList = getStoredTableList(context);
  return tableList.find((t) => t.id === id);
}

export async function addStoredTable(
  context: ExtensionContext,
  tableInfo: StoredTableInfo
): Promise<void> {
  const tableList = getStoredTableList(context);
  const store = new Map<string, StoredTableInfo>(
    tableList.map((t) => [t.id, t])
  );
  store.set(tableInfo.id, tableInfo);
  context.globalState.update("tableList", Array.from(store.values()));
}
