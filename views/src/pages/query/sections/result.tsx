import styled from "@emotion/styled";
import React from "react";
import type { LeanRow } from "../../../hooks/useTableQuery";
import ReactJson from "react-json-view";

import { Colors, Padding } from "../../../styling";
import { css } from "@emotion/react";

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ResultView = styled.code`
  background: ${Colors.grey};
  flex: 1;
  color: white;
  display: flex;
  padding: ${Padding.medium}px;
`;

type Props = {
  rows: LeanRow[];
};
export function Results(props: Props) {
  return (
    <Container>
      <ResultView>
        <ReactJson
          style={{ width: "100%" }}
          theme="google"
          shouldCollapse={(field: any) => field.name === "data"}
          src={props.rows}
        />
      </ResultView>
    </Container>
  );
}
