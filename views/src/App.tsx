import React from "react";

import { PageContext, useInitPage } from "./hooks/useInitPage";
import { QueryPage } from "./pages/query";
import { ConfigurePage } from "./pages/configure";
import { ScreenLoader } from "./components/screenloader";

export function App() {
  const { context, loading, error } = useInitPage();
  if (error || !context) {
    return (
      <div>
        <div>{error?.message ?? "Something went wrong"}</div>
        <div>err: {JSON.stringify(error)}</div>
        <div>context: {JSON.stringify(context)}</div>
      </div>
    );
  }

  if (loading) {
    return <ScreenLoader />;
  }

  return (
    <PageContext.Provider value={context}>
      {context?.page === "query" ? (
        <QueryPage context={context} />
      ) : (
        <ConfigurePage context={context} />
      )}
    </PageContext.Provider>
  );
}
