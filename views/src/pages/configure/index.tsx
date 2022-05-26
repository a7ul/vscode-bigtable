import styled from "@emotion/styled";
import { useForm, SubmitHandler } from "react-hook-form";

import React, { useEffect } from "react";
import type { ConfigurePageContextValue } from "../../hooks/useInitPage";
import {
  VSCodeButton,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import type { BigtableOptions } from "@google-cloud/bigtable";
import { client } from "../../utils/messages";

const RootContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 20px;
`;

type TableInfo = {
  id: string;
  displayName: string;
  clientOptions: BigtableOptions;
  instanceId: string;
  tableId: string;
};
// const t: TableInfo = {};

const PageTitle = styled.h2`
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid dimgray;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 300px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled(VSCodeButton)`
  margin-top: 30px;
`;

const Title = styled.h3`
  margin: 20px 0 10px 0;
`;

const ErrorText = styled.span`
  color: orange;
  padding-top: 5px;
`;

type FormInputs = {
  displayName: string;
  projectId: string;
  instanceId: string;
  tableId: string;
  apiEndpoint?: string;
  _init?: string;
};

type Props = {
  context: ConfigurePageContextValue;
};
export function ConfigurePage(props: Props) {
  const storedTableId = props.context.storedTableId;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (storedTableId) {
      clearErrors("_init");
      client
        .request<TableInfo>("getSavedTable", { id: storedTableId })
        .then((tableInfo) => {
          setValue("displayName", tableInfo.displayName);
          setValue("projectId", tableInfo.clientOptions.projectId!);
          setValue("instanceId", tableInfo.instanceId);
          setValue("tableId", tableInfo.tableId);
          setValue("apiEndpoint", tableInfo.clientOptions.apiEndpoint);
        })
        .catch((err) => {
          console.error("Error getting saved table", err);
          setError("_init", {
            message: err?.message ?? JSON.stringify(err, undefined, 2),
          });
        });
    }
  }, [storedTableId]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const internalId =
      storedTableId ??
      `${data.projectId}_${data.instanceId}_${data.tableId}_${
        data.displayName
      }_${data.apiEndpoint ?? ""}`;
    const tableInfo: TableInfo = {
      id: internalId,
      displayName: data.displayName,
      clientOptions: {
        projectId: data.projectId,
        apiEndpoint: data.apiEndpoint,
      },
      instanceId: data.instanceId,
      tableId: data.tableId,
    };

    await client.request<{ id: string }>("createSavedTable", tableInfo);
  };

  const pageTitle = props.context.storedTableId
    ? "Configure Bigtable"
    : "+ Connect new Bigtable";
  return (
    <RootContainer>
      <Form>
        <PageTitle>{pageTitle}</PageTitle>
        {errors._init ? (
          <ErrorText> {errors._init.message} </ErrorText>
        ) : (
          <>
            <FormField>
              <Title>Display name</Title>
              <VSCodeTextField
                title="displaName"
                placeholder="My favourite table"
                {...register("displayName", { required: true })}
              />
              {errors.displayName && (
                <ErrorText>This field is required</ErrorText>
              )}
            </FormField>
            <FormField>
              <Title>Project id</Title>
              <VSCodeTextField
                title="Project ID"
                placeholder="gcp_project_name"
                {...register("projectId", { required: true })}
              />
              {errors.projectId && (
                <ErrorText>This field is required</ErrorText>
              )}
            </FormField>
            <FormField>
              <Title>Instance id</Title>
              <VSCodeTextField
                title="Instance ID"
                placeholder="bigtable_instance_name"
                {...register("instanceId", { required: true })}
              />
              {errors.instanceId && (
                <ErrorText>This field is required</ErrorText>
              )}
            </FormField>
            <FormField>
              <Title>Table id</Title>
              <VSCodeTextField
                title="Table ID"
                placeholder="table_name"
                {...register("tableId", { required: true })}
              />
              {errors.tableId && <ErrorText>This field is required</ErrorText>}
            </FormField>
            <FormField>
              <Title>Custom api url</Title>
              <VSCodeTextField
                title="Api URL"
                placeholder="emulator_url (example: localhost:8081)"
                {...register("apiEndpoint")}
              />
            </FormField>
            <SubmitButton onClick={handleSubmit(onSubmit)}>
              Connect
            </SubmitButton>
          </>
        )}
      </Form>
    </RootContainer>
  );
}
