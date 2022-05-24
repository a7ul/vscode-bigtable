import styled from "@emotion/styled";
import { GetRowsOptions } from "@google-cloud/bigtable";
import React, { useEffect } from "react";
import { client } from "../../../utils/messages";
import { QueryType } from "../types";
import { ActionsBar } from "./actions";
import { Editor } from "./editor";

function cleanupRowKey(rowKey: string) {
  const key = rowKey.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    return key.slice(1, -1);
  }
  return key;
}

function parseRowKeyPrefixes(raw: string) {
  let text = raw.trim();
  const lines = text.split("\n");
  return lines.map((line) => {
    return cleanupRowKey(line);
  });
}

function parseRowKeyRanges(raw: string) {
  let text = raw.trim();
  const lines = text.split("\n");
  return lines.map((rawLine) => {
    const line = rawLine.trim();
    const [start, end] = line.split(",");
    return {
      ...(start && { start: cleanupRowKey(start) }),
      ...(end && { end: cleanupRowKey(end) }),
    };
  });
}

function createRowOptions(
  type: QueryType,
  rawQuery: string,
  limit: number
): GetRowsOptions {
  const defaults: GetRowsOptions = { limit };
  switch (type) {
    case QueryType.prefixes: {
      return {
        ...defaults,
        prefixes: parseRowKeyPrefixes(rawQuery),
      };
    }
    case QueryType.rowKeys: {
      return {
        ...defaults,
        keys: parseRowKeyPrefixes(rawQuery),
      };
    }
    case QueryType.keyRanges: {
      return {
        ...defaults,
        ranges: parseRowKeyRanges(rawQuery),
      };
    }
    case QueryType.advanced: {
      try {
        const options = JSON.parse(rawQuery);
        return {
          ...defaults,
          ...options,
        };
      } catch (err: any) {
        client.request("showError", {
          message: `Error parsing: ${err?.message}`,
        });
        console.error(err);
        return defaults;
      }
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
  const [queryType, setQueryType] = React.useState(QueryType.prefixes);
  const [rawQuery, setRawQuery] = React.useState<string>("");
  const [limit, setLimit] = React.useState<number>(300);

  useEffect(() => {
    props.onExecute({ limit });
  }, []);

  return (
    <>
      <TopPane>
        <Editor
          text={rawQuery}
          queryType={queryType}
          onTextChange={(text) => setRawQuery(text)}
        />
      </TopPane>
      <CenterPane>
        <ActionsBar
          limit={limit}
          setLimit={(limit) => setLimit(limit)}
          loading={props.loading}
          onExecute={() =>
            props.onExecute(createRowOptions(queryType, rawQuery, limit))
          }
          setQueryType={(type) => setQueryType(type)}
        />
      </CenterPane>
    </>
  );
}
