import styled from "@emotion/styled";

import React from "react";
import type { ConfigurePageContextValue } from "../../hooks/useInitPage";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

const RootContainer = styled.main`
  padding: 0;
  flex: 1;
  display: flex;
`;

type Props = {
  context: ConfigurePageContextValue;
};

export function ConfigurePage(props: Props) {
  return (
    <RootContainer>
      <div>
        <VSCodeButton slot="add">Add new</VSCodeButton>
      </div>
    </RootContainer>
  );
}
