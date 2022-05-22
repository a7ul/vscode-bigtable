import { Editor } from "./sections/editor";

import { Results } from "./sections/result";
import { SplitPane } from "../../components/splitpane";
import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { QueryPageContextValue } from "../../hooks/useInitPage";
import { useTableQuery } from "../../hooks/useTableQuery";
import { ActionsBar } from "./sections/actions";
import { GetRowsOptions } from "@google-cloud/bigtable";
import { QueryType } from "./types";

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

function createRowOptions(type: QueryType, rawQuery: string): GetRowsOptions {
  const defaults: GetRowsOptions = { limit: 200 };
  switch (type) {
    case QueryType.prefix: {
      return {
        ...defaults,
        prefix: rawQuery,
      };
    }
  }
}

export function QueryPage(props: Props) {
  const { getRows, rows, loading, error } = useTableQuery(props.context.table);
  const [rawQuery, setRawQuery] = React.useState<string>("");
  const [queryType, setQueryType] = React.useState(QueryType.prefix);

  useEffect(() => {
    getRows(createRowOptions(queryType, rawQuery));
  }, []);

  return (
    <RootContainer>
      <SplitPane.Container>
        <SplitPane.Pane>
          <Editor
            type={queryType}
            text={rawQuery}
            onTextChange={(text) => setRawQuery(text)}
          />
        </SplitPane.Pane>
        <SplitPane.Pane>
          <BottomPaneContainer>
            <ActionsBar
              loading={loading}
              onExecute={() => getRows(createRowOptions(queryType, rawQuery))}
              setQueryType={(type) => setQueryType(type)}
            />
            <Results rows={rows} loading={loading} error={error} />
          </BottomPaneContainer>
        </SplitPane.Pane>
      </SplitPane.Container>
    </RootContainer>
  );
}
