import styled from "@emotion/styled";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import React from "react";

const Container = styled.main`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export function ScreenLoader() {
  return (
    <Container>
      <VSCodeProgressRing />
    </Container>
  );
}
