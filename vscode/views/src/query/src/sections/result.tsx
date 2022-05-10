import styled from "@emotion/styled";
import React from "react";
import { Colors, Padding } from "../styling";

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

export function Results() {
  return (
    <Container>
      <ResultView>
        {`
          {
            "name": "John"
          }
          `}
      </ResultView>
    </Container>
  );
}
