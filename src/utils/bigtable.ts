import {
  Bigtable,
  Instance as BigtableInstance,
  Table as BigtableTable,
  GetRowsOptions as BigtableGetRowOptions,
  BigtableOptions,
} from "@google-cloud/bigtable";
import { ProjectsClient, protos } from "@google-cloud/resource-manager";

const resourceManager = new ProjectsClient();

export type Project = protos.google.cloud.resourcemanager.v3.IProject;

export async function getProjects(): Promise<Project[]> {
  const projects: Project[] = [];
  for await (const project of resourceManager.searchProjectsAsync()) {
    projects.push(project);
  }
  return projects;
}

export type Instance = BigtableInstance;

type GetInstancesParams = BigtableOptions;
export async function getInstances(
  options: GetInstancesParams
): Promise<Instance[]> {
  const bigtable = new Bigtable(options);
  const [instances] = await bigtable.getInstances();
  return instances;
}

export type Table = BigtableTable;
type GetTablesParams = {
  clientOptions: BigtableOptions;
  instanceId: string;
};
export async function getTables(params: GetTablesParams): Promise<Table[]> {
  const bigtable = new Bigtable(params.clientOptions);
  const [tables] = await bigtable.instance(params.instanceId).getTables();
  return tables;
}

export type TableInfo = {
  clientOptions: BigtableOptions;
  instanceId: string;
  tableId: string;
};
export async function getTable(params: TableInfo): Promise<Table> {
  const bigtable = new Bigtable(params.clientOptions);
  const table = bigtable.instance(params.instanceId).table(params.tableId);
  await table.exists();
  return table;
}

export type GetRowsParams = {
  clientOptions: BigtableOptions;
  instanceId: string;
  tableId: string;
  options?: BigtableGetRowOptions;
};
export async function getRows(params: GetRowsParams) {
  const bigtable = new Bigtable(params.clientOptions);
  const table = bigtable.instance(params.instanceId).table(params.tableId);
  const limit = params.options?.limit ?? 1000;
  const [rows] = await table.getRows({ ...params?.options, limit });
  return rows;
}
