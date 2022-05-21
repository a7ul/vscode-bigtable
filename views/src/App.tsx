import React from "react";

import { PageContext, useInitPage } from "./hooks/useInitPage";
import { QueryPage } from "./pages/query";

export function App() {
  const { context, loading, error } = useInitPage();
  if (error) {
    return <div>{error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(context);

  return (
    <PageContext.Provider value={context}>
      {context?.page === "query" ? (
        <QueryPage context={context} />
      ) : context?.page === "something" ? (
        <div>Something</div>
      ) : (
        <div>Something went wrong! (Unknown context)</div>
      )}
    </PageContext.Provider>
  );
}
