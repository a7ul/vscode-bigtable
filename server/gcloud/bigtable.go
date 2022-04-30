package gcloud

import (
	"context"
	"log"

	"cloud.google.com/go/bigtable"
)

type Instance struct {
	ProjectID     string                 `json:"projectId"`
	InstanceId    string                 `json:"instanceId"`
	DisplayName   string                 `json:"displayName"`
	InstanceState bigtable.InstanceState `json:"instanceState"`
	InstanceType  bigtable.InstanceType  `json:"instanceType"`
	Labels        map[string]string      `json:"labels"`
}

func toInstance(projectId string, instance *bigtable.InstanceInfo) Instance {
	return Instance{
		ProjectID:     projectId,
		InstanceId:    instance.Name,
		DisplayName:   instance.DisplayName,
		InstanceState: instance.InstanceState,
		InstanceType:  instance.InstanceType,
		Labels:        instance.Labels,
	}
}

type TableListItem struct {
	ProjectId  string `json:"projectId"`
	InstanceId string `json:"instance"`
	TableId    string `json:"tableId"`
}

type ColumnFamily struct {
	Name     string `json:"name"`
	GCPolicy string `json:"gcpolicy"`
}

type Table struct {
	ProjectId      string         `json:"projectId"`
	InstanceId     string         `json:"instanceId"`
	TableId        string         `json:"tableId"`
	ColumnFamilies []ColumnFamily `json:"columnFamilies"`
}

func toTable(projectId string, instanceId string, tableId string, table *bigtable.TableInfo) Table {
	columnFamilies := make([]ColumnFamily, len(table.FamilyInfos))
	for i, family := range table.FamilyInfos {
		columnFamilies[i] = ColumnFamily{
			Name:     family.Name,
			GCPolicy: family.GCPolicy,
		}
	}
	return Table{
		ProjectId:      projectId,
		InstanceId:     instanceId,
		TableId:        tableId,
		ColumnFamilies: columnFamilies,
	}
}

func GetInstances(ctx context.Context, projectID string) []Instance {
	client, err := bigtable.NewInstanceAdminClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Could not create instance admin client: %v", err)
	}
	defer client.Close()

	instances, err := client.Instances(ctx)
	if err != nil {
		log.Fatalf("Could not get instances: %v", err)
	}

	var results []Instance
	for _, instance := range instances {
		results = append(results, toInstance(projectID, instance))
	}
	return results
}

func GetInstance(ctx context.Context, projectID string, instanceId string) Instance {
	client, err := bigtable.NewInstanceAdminClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Could not create client: %v", err)
	}
	defer client.Close()

	instance, e := client.InstanceInfo(ctx, instanceId)
	if e != nil {
		log.Fatalf("Could not get instance: %v", e)
	}
	return toInstance(projectID, instance)
}

func GetTables(ctx context.Context, projectId string, instanceId string) []TableListItem {
	client, err := bigtable.NewAdminClient(ctx, projectId, instanceId)
	if err != nil {
		log.Fatalf("Could not create data operations client: %v", err)
	}
	defer client.Close()

	tableList, e := client.Tables(ctx)

	if e != nil {
		log.Fatalf("Could not get tables: %v", e)
	}

	var results []TableListItem
	for _, tableId := range tableList {
		results = append(results, TableListItem{
			ProjectId:  projectId,
			InstanceId: instanceId,
			TableId:    tableId,
		})
	}

	return results
}

func GetTable(ctx context.Context, projectId string, instanceId string, tableId string) Table {
	client, err := bigtable.NewAdminClient(ctx, projectId, instanceId)
	if err != nil {
		log.Fatalf("Could not create data operations client: %v", err)
	}
	defer client.Close()

	tableInfo, e := client.TableInfo(ctx, tableId)
	if e != nil {
		log.Fatalf("Could not get table: %v", e)
	}
	return toTable(projectId, instanceId, tableId, tableInfo)
}
