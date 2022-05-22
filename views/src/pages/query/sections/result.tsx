import styled from "@emotion/styled";
import React from "react";
import type { LeanRow } from "../../../hooks/useTableQuery";
import ReactJson from "react-json-view";

const BottomPane = styled.section`
  display: flex;
  min-height: 50px;
  margin-top: 5px;
  flex-grow: 1;
  overflow: auto;
`;

const Container = styled.section`
  display: flex;
  flex: 1;
  width: 100%;
  border: 1px solid dimgrey;
  overflow: auto;
  position: relative;
`;

type Props = {
  rows: LeanRow[];
  loading?: boolean;
  error: Error | null;
};

function formatError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

export function Results(props: Props) {
  return (
    <BottomPane>
      <Container>
        <ReactJson
          style={{ width: "100%", borderWidth: 0 }}
          theme="google"
          shouldCollapse={(field: any) => field.name === "data"}
          src={props.error ? formatError(props.error) : props.rows}
        />
      </Container>
    </BottomPane>
  );
}
