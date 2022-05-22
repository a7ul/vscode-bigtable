import React, { useRef } from "react";
import styled from "@emotion/styled";

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
  loading?: boolean;
};
export function Editor(props: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <Container>
      <TextArea
        ref={textAreaRef}
        autoFocus={false}
        placeholder="Enter prefix"
      />
    </Container>
  );
}
