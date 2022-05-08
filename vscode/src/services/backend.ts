import {
  Bigtable,
  Instance as BigtableInstance,
  Table as BigtableTable,
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
