import React from "react";
import styled from "@emotion/styled";
import { QueryType } from "../types";

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
`;

type Props = {
  type: QueryType;
  text: string;
  onTextChange: (text: string) => void;
};
export function Editor(props: Props) {
  return (
    <Container>
      <TextArea
        value={props.text}
        onChange={(e) => props.onTextChange(e.target.value)}
        autoFocus={false}
        placeholder="Enter prefix"
      />
    </Container>
  );
}
