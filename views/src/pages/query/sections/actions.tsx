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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0 1px 0;
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Progress = styled(VSCodeProgressRing)`
  height: 20px;
  margin-left: 5px;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

type Props = {
  onExecute: () => void;
  loading?: boolean;
  setQueryType: (type: QueryType) => void;
  limit?: number;
  setLimit: (limit: number) => void;
};
export function ActionsBar(props: Props) {
  return (
    <Container>
      <ActionContainer>
        <VSCodeButton
          disabled={props.loading}
          onClick={() => props.onExecute()}
        >
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
      <PaginationContainer>
        <VSCodeDropdown title="limit">
          <VSCodeOption onClick={() => props.setLimit(300)}>300</VSCodeOption>
          <VSCodeOption onClick={() => props.setLimit(500)}>500</VSCodeOption>
          <VSCodeOption onClick={() => props.setLimit(1000)}>1000</VSCodeOption>
          <VSCodeOption onClick={() => props.setLimit(2000)}>2000</VSCodeOption>
          <VSCodeOption onClick={() => props.setLimit(5000)}>5000</VSCodeOption>
        </VSCodeDropdown>
      </PaginationContainer>
    </Container>
  );
}
