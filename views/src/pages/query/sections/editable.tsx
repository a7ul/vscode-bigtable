import styled from "@emotion/styled";
import { GetRowsOptions } from "@google-cloud/bigtable";
import React, { useEffect } from "react";
import { QueryType } from "../types";
import { ActionsBar } from "./actions";
import { Editor } from "./editor";

function cleanupRowKey(rawKey: string) {
  let key = rawKey.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    return key.slice(1, -1);
  }
  return key;
}

function createRowOptions(type: QueryType, rawQuery: string): GetRowsOptions {
  const defaults: GetRowsOptions = { limit: 200 };
  switch (type) {
    case QueryType.prefix: {
      return {
        ...defaults,
        prefix: cleanupRowKey(rawQuery),
      };
    }
  }
}

const TopPane = styled.section`
  display: flex;
  min-height: 50px;
  overflow: auto;
  resize: vertical;
  flex-shrink: 0;
  max-height: calc(100vh - 200px);
  flex-direction: column;
`;

const CenterPane = styled.section``;

type Props = {
  loading: boolean;
  onExecute: (options: GetRowsOptions) => void;
};

export function Editable(props: Props) {
  const [rawQuery, setRawQuery] = React.useState<string>("");
  const [queryType, setQueryType] = React.useState(QueryType.prefix);

  useEffect(() => {
    props.onExecute({ limit: 300 });
  }, []);

  return (
    <>
      <TopPane>
        <Editor
          type={queryType}
          text={rawQuery}
          onTextChange={(text) => setRawQuery(text)}
        />
      </TopPane>
      <CenterPane>
        <ActionsBar
          loading={props.loading}
          onExecute={() =>
            props.onExecute(createRowOptions(queryType, rawQuery))
          }
          setQueryType={(type) => setQueryType(type)}
        />
      </CenterPane>
    </>
  );
}