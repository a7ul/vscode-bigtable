import React, { useContext, useEffect, useState } from "react";
import { Editor } from "./sections/editor";

import { Results } from "./sections/result";
import { SplitPane } from "./components/splitpane";
import styled from "@emotion/styled";
import { Padding } from "./styling";
import {
  QueryPageContext,
  QueryPageContextValue,
} from "./hooks/QueryPageContext";
import { client } from "../../utils/messages";

const RootContainer = styled.main`
  padding: 0;
  padding-top: ${Padding.large}px;
  flex: 1;
  display: flex;
`;

export function App() {
  const [context, setContext] = useState<QueryPageContextValue | null>(null);
  useEffect(() => {
    async function main() {
      const ctx = await client.request<QueryPageContextValue>("context");
      setContext(ctx);
    }
    main().catch(() => console.error("Error getting context"));
  }, []);
  return (
    <QueryPageContext.Provider value={context}>
      <RootContainer>
        <SplitPane.Container>
          <SplitPane.Pane>
            <Editor />
          </SplitPane.Pane>
          <SplitPane.Pane>
            <Results />
          </SplitPane.Pane>
        </SplitPane.Container>
      </RootContainer>
    </QueryPageContext.Provider>
  );
}
