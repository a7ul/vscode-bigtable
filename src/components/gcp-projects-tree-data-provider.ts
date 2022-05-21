import { randomUUID } from "crypto";
import * as vscode from "vscode";
import {
  getInstances,
  getProjects,
  getTables,
  Instance,
  Project,
  Table,
} from "../utils/bigtable";

export class GCPBigtableTreeDataProvider
  implements vscode.TreeDataProvider<BigtableTreeItem>
{
  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getTreeItem(element: BigtableTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: BigtableTreeItem): Promise<BigtableTreeItem[]> {
    if (!element) {
      const projects = await getProjects();
      return projects.map(
        (project) => new ProjectTreeItem(this.context, project)
      );
    }
    return element.getChildren();
  }
}

abstract class BigtableTreeItem extends vscode.TreeItem {
  abstract context: vscode.ExtensionContext;
  abstract getChildren(): Promise<BigtableTreeItem[]>;

  // @ts-ignore
  get resourceUri() {
    return vscode.Uri.joinPath(this.context.extensionUri, "resources");
  }
}

class ProjectTreeItem extends BigtableTreeItem {
  context: vscode.ExtensionContext;
  project: Project;
  constructor(context: vscode.ExtensionContext, project: Project) {
    const label = project.displayName ?? project.name ?? "Unknown";
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.context = context;
    this.project = project;
    this.id = this.project.projectId ?? randomUUID();
    this.iconPath = vscode.Uri.joinPath(this.resourceUri, "gcp-project.svg");
    this.description = this.project.projectId ?? false;
    this.tooltip = this.project.projectId ?? undefined;
  }
  async getChildren(): Promise<BigtableTreeItem[]> {
    if (!this.project?.projectId) {
      return [];
    }
    const instances = await getInstances({ projectId: this.project.projectId });
    return instances.map((i) => new InstanceTreeItem(this.context, i));
  }
}

class InstanceTreeItem extends BigtableTreeItem {
  context: vscode.ExtensionContext;
  instance: Instance;

  constructor(context: vscode.ExtensionContext, instance: Instance) {
    const label = instance.id;
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.context = context;
    this.instance = instance;
    this.id = `${this.instance.bigtable.projectId}_${this.instance.id}`;
    this.iconPath = vscode.Uri.joinPath(this.resourceUri, "bigtable.svg");
    this.description = this.instance.name ?? false;
    this.tooltip = this.instance.name ?? undefined;
  }

  async getChildren(): Promise<BigtableTreeItem[]> {
    const tables = await getTables({
      instanceId: this.instance.id,
      projectId: this.instance.bigtable.projectId,
    });
    return tables.map((t) => new TableTreeItem(this.context, t));
  }
}

export class TableTreeItem extends BigtableTreeItem {
  context: vscode.ExtensionContext;
  table: Table;

  constructor(context: vscode.ExtensionContext, table: Table) {
    const label = table.id;
    super(label);
    this.context = context;
    this.table = table;
    this.id = this.table.name;
    this.iconPath = vscode.Uri.joinPath(this.resourceUri, "table.svg");
    this.description = this.table.name ?? false;
    this.tooltip = this.table.name ?? undefined;
    this.command = {
      title: "Add Bigtable Table",
      command: "vscodeBigtable_command_addTable",
      arguments: [
        this.table.name, // id
        this.table.bigtable.projectId, // projectId
        this.table.instance.id, // instanceId
        this.table.id, // tableId
        this.table.id, // displayName
      ],
    };
  }

  async getChildren(): Promise<BigtableTreeItem[]> {
    return [];
  }
}
