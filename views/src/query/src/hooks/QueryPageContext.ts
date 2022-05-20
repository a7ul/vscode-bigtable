import React from "react";

export type QueryPageContextValue = {
  projectId: string;
  instanceId: string;
  tableId: string;
};

export const QueryPageContext =
  React.createContext<QueryPageContextValue | null>(null);
