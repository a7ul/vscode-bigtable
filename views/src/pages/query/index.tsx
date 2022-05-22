import { Editor } from "./sections/editor";

import { Results } from "./sections/result";
import { SplitPane } from "../../components/splitpane";
import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { QueryPageContextValue } from "../../hooks/useInitPage";
import { useTableQuery } from "../../hooks/useTableQuery";
import { ActionsBar } from "./sections/actions";
import { GetRowsOptions } from "@google-cloud/bigtable";

const RootContainer = styled.main`
  padding: 0;
  padding-top: 10px;
  flex: 1;
  display: flex;
`;
const BottomPaneContainer = styled.section`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
`;

type Props = {
  context: QueryPageContextValue;
};
export function QueryPage(props: Props) {
  const { getRows, rows, loading, error } = useTableQuery(props.context.table);
  const [rowOptions, setRowOptions] = React.useState<GetRowsOptions>({
    limit: 200,
  });
  useEffect(() => {
    getRows(rowOptions);
  }, []);
  return (
    <RootContainer>
      <SplitPane.Container>
        <SplitPane.Pane>
          <Editor />
        </SplitPane.Pane>
        <SplitPane.Pane>
          <BottomPaneContainer>
            <ActionsBar
              loading={loading}
              onExecute={() => getRows({})}
              setQueryType={(type) => {}}
            />
            <Results rows={rows} loading={loading} error={error} />
          </BottomPaneContainer>
        </SplitPane.Pane>
      </SplitPane.Container>
    </RootContainer>
  );
}
