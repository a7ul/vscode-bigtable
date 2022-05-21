import { Editor } from "./sections/editor";

import { Results } from "./sections/result";
import { SplitPane } from "../../components/splitpane";
import styled from "@emotion/styled";
import { Padding } from "../../styling";
import React, { useEffect } from "react";
import { QueryPageContextValue } from "../../hooks/useInitPage";
import { useTableQuery } from "../../hooks/useTableQuery";

const RootContainer = styled.main`
  padding: 0;
  padding-top: ${Padding.large}px;
  flex: 1;
  display: flex;
`;

type Props = {
  context: QueryPageContextValue;
};
export function QueryPage(props: Props) {
  const { getRows, rows, loading, error } = useTableQuery(props.context.table);
  useEffect(() => {
    getRows({ limit: 200 });
  }, []);
  return (
    <RootContainer>
      <SplitPane.Container>
        <SplitPane.Pane>
          <Editor onExecute={(prefix) => getRows({ prefix })} />
        </SplitPane.Pane>
        <SplitPane.Pane>
          <Results rows={rows} />
        </SplitPane.Pane>
      </SplitPane.Container>
    </RootContainer>
  );
}
