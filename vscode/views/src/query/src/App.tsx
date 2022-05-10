import React from "react";

import { Editor } from "./sections/editor";

import { Results } from "./sections/result";
import { SplitPane } from "./components/splitpane";
import styled from "@emotion/styled";
import { Padding } from "./styling";

const RootContainer = styled.main`
  padding: 0;
  padding-top: ${Padding.large}px;
  flex: 1;
  display: flex;
`;

export function App() {
  return (
    <RootContainer>
      <SplitPane.Container>
        <SplitPane.Pane>
          <Editor />
        </SplitPane.Pane>
        <SplitPane.Pane>
          <Results />
        </SplitPane.Pane>
      </SplitPane.Container>
    </RootContainer>
  );
}
