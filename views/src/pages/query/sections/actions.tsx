import styled from "@emotion/styled";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { Spacer } from "../../../components/spacer";
import { QueryType } from "../types";

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0 1px 0;
`;

const Progress = styled(VSCodeProgressRing)`
  height: 20px;
  margin-left: 5px;
`;

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
        {Object.values(QueryType).map((type) => (
          <VSCodeOption key={type} onClick={() => props.setQueryType(type)}>
            {type}
          </VSCodeOption>
        ))}
      </VSCodeDropdown>
      {props.loading ? <Progress /> : null}
    </ActionContainer>
  );
}
