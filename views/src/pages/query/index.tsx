import { Results } from "./sections/result";
import styled from "@emotion/styled";
import React from "react";
import { QueryPageContextValue } from "../../hooks/useInitPage";
import { useTableQuery } from "../../hooks/useTableQuery";

import { Editable } from "./sections/Editable";

const RootContainer = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: calc(100vw - 45px);
  padding: 0;
  padding-top: 10px;
`;

type Props = {
  context: QueryPageContextValue;
};

export function QueryPage(props: Props) {
  const { getRows, rows, loading, error } = useTableQuery(props.context.table);

  return (
    <RootContainer>
      <Editable
        loading={loading}
        onExecute={(rowOptions) => getRows(rowOptions)}
      />
      <Results rows={rows} loading={loading} error={error} />
    </RootContainer>
  );
}
