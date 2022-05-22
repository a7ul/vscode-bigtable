import styled from "@emotion/styled";
import { GetRowOptions } from "@google-cloud/bigtable";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { Spacer } from "../../../components/spacer";

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 2px 0 7px 0;
`;

const Progress = styled(VSCodeProgressRing)`
  height: 20px;
  margin-left: 5px;
`;

enum QueryType {
  prefix = "prefix",
  range = "range",
  rowKeys = "rowKeys",
}
type Props = {
  onExecute: () => void;
  loading?: boolean;
  setQueryType: (type: QueryType) => void;
};
export function ActionsBar(props: Props) {
  return (
    <ActionContainer>
      <VSCodeButton disabled={props.loading} onClick={() => props.onExecute()}>
        Execute
      </VSCodeButton>
      <Spacer width={5} />
      <VSCodeDropdown>
        <VSCodeOption onClick={() => props.setQueryType(QueryType.prefix)}>
          Prefix
        </VSCodeOption>
        <VSCodeOption onClick={() => props.setQueryType(QueryType.rowKeys)}>
          RowKeys
        </VSCodeOption>
        <VSCodeOption onClick={() => props.setQueryType(QueryType.range)}>
          Range
        </VSCodeOption>
      </VSCodeDropdown>
      {props.loading ? <Progress /> : null}
    </ActionContainer>
  );
}
