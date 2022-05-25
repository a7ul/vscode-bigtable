import styled from "@emotion/styled";

import React from "react";
import type { ConfigurePageContextValue } from "../../hooks/useInitPage";
import {
  VSCodeButton,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import type { BigtableOptions } from "@google-cloud/bigtable";

const RootContainer = styled.main`
  padding: 0;
  flex: 1;
  display: flex;
`;

type Props = {
  context: ConfigurePageContextValue;
};

type TableInfo = {
  id: string;
  displayName: string;
  clientOptions: BigtableOptions;
  instanceId: string;
  tableId: string;
};
// const t: TableInfo = {};

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormField = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

export function ConfigurePage(props: Props) {
  return (
    <RootContainer>
      <Form>
        <FormField>
          Display Name
          <VSCodeTextField
            title="displaName"
            placeholder="My favourite table"
          />
        </FormField>
        <FormField>
          Project ID
          <VSCodeTextField title="Project ID" placeholder="" />
        </FormField>
        <FormField>
          Instance ID
          <VSCodeTextField title="Instance ID" />
        </FormField>
        <FormField>
          Table ID
          <VSCodeTextField title="Table ID" />
        </FormField>
        <VSCodeButton slot="add">Add new</VSCodeButton>
      </Form>
    </RootContainer>
  );
}
