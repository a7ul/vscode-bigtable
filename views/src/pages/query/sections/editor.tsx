import React from "react";
import styled from "@emotion/styled";
import { QueryType } from "../types";

function createPlaceHolder(type: QueryType): string {
  switch (type) {
    case QueryType.prefixes: {
      return "Enter prefixes that row keys must match, one per line";
    }
    case QueryType.rowKeys: {
      return "Enter row keys, one per line";
    }
    case QueryType.keyRanges: {
      return `Enter one row key range per line.
Format: start_row_key,end_row_key`;
    }
    case QueryType.advanced: {
      return `Enter the query in JSON format (GetRowsOptions)`;
    }
  }
}

const TextArea = styled.textarea`
  resize: none;
  width: 100%;
  height: 100%;
  background-color: #373737;
  color: white;
  padding: 8px;
`;

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
`;

const Link = styled.a`
  position: absolute;
  top: 5px;
  right: 5px;
`;

type Props = {
  queryType: QueryType;
  text: string;
  onTextChange: (text: string) => void;
};
export function Editor(props: Props) {
  return (
    <>
      <Container>
        <TextArea
          value={props.text}
          onChange={(e) => props.onTextChange(e.target.value)}
          autoFocus={false}
          placeholder={createPlaceHolder(props.queryType)}
        />
        {props.queryType === QueryType.advanced ? (
          <Link href="https://github.com/googleapis/nodejs-bigtable/blob/033bfc878c2aeb40cc40ca66f905e47810f42c12/src/table.ts#L195">
            spec?
          </Link>
        ) : null}
      </Container>
    </>
  );
}
