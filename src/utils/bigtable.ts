import {
  Bigtable,
  Instance as BigtableInstance,
  Table as BigtableTable,
  GetRowsOptions as BigtableGetRowOptions,
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
type GetInstancesParams = {
  projectId: string;
};
export async function getInstances(
  params: GetInstancesParams
): Promise<Instance[]> {
  const bigtable = new Bigtable({ projectId: params.projectId });
  const [instances] = await bigtable.getInstances();
  return instances;
}

export type Table = BigtableTable;
type GetTablesParams = {
  projectId: string;
  instanceId: string;
};
export async function getTables(params: GetTablesParams): Promise<Table[]> {
  const bigtable = new Bigtable({ projectId: params.projectId });
  const [tables] = await bigtable.instance(params.instanceId).getTables();
  return tables;
}

export type TableInfo = {
  projectId: string;
  instanceId: string;
  tableId: string;
};
export async function getTable(params: TableInfo): Promise<Table> {
  const bigtable = new Bigtable({ projectId: params.projectId });
  const table = bigtable.instance(params.instanceId).table(params.tableId);
  await table.exists();
  return table;
}

export type GetRowsParams = {
  projectId: string;
  instanceId: string;
  tableId: string;
  options?: BigtableGetRowOptions;
};
export async function getRows(params: GetRowsParams) {
  const bigtable = new Bigtable({ projectId: params.projectId });
  const table = bigtable.instance(params.instanceId).table(params.tableId);
  const limit = params.options?.limit ?? 1000;
  const [rows] = await table.getRows({ ...params?.options, limit });
  return rows;
}
