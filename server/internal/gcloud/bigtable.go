package gcloud

import (
	"context"
	"log"

	"cloud.google.com/go/bigtable"
	"github.com/samber/lo"
)

type Instance struct {
	ProjectID     string                 `json:"projectId"`
	InstanceId    string                 `json:"instanceId"`
	DisplayName   string                 `json:"displayName"`
	InstanceState bigtable.InstanceState `json:"instanceState"`
	InstanceType  bigtable.InstanceType  `json:"instanceType"`
	Labels        map[string]string      `json:"labels"`
}

func toInstance(projectId string, instance *bigtable.InstanceInfo) *Instance {
	return &Instance{
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

type ColumnFamilyInfo struct {
	Name     string `json:"name"`
	GCPolicy string `json:"gcpolicy"`
}

type Table struct {
	ProjectId      string             `json:"projectId"`
	InstanceId     string             `json:"instanceId"`
	TableId        string             `json:"tableId"`
	ColumnFamilies []ColumnFamilyInfo `json:"columnFamilies"`
}

func toTable(projectId string, instanceId string, tableId string, table *bigtable.TableInfo) *Table {
	columnFamilies := make([]ColumnFamilyInfo, len(table.FamilyInfos))
	for i, family := range table.FamilyInfos {
		columnFamilies[i] = ColumnFamilyInfo{
			Name:     family.Name,
			GCPolicy: family.GCPolicy,
		}
	}
	return &Table{
		ProjectId:      projectId,
		InstanceId:     instanceId,
		TableId:        tableId,
		ColumnFamilies: columnFamilies,
	}
}

type Cell struct {
	Family    string             `json:"family"`
	Column    string             `json:"column"`
	Timestamp bigtable.Timestamp `json:"timestamp"`
	Value     []byte             `json:"value"`
	Labels    []string           `json:"labels"`
}

func toCell(columnFamily string, item bigtable.ReadItem) Cell {
	return Cell{
		Family:    columnFamily,
		Column:    item.Column,
		Timestamp: item.Timestamp,
		Value:     item.Value,
		Labels:    item.Labels,
	}
}

type Row struct {
	RowKey string            `json:"rowKey"`
	Cells  map[string][]Cell `json:"cells"`
}

func toRow(row bigtable.Row) Row {
	var cells = make(map[string][]Cell)

	for columnFamily, readItems := range row {
		groupedByColumn := lo.GroupBy(readItems, func(item bigtable.ReadItem) string {
			return item.Column
		})
		for column, columnReadItems := range groupedByColumn {
			cells[column] = lo.Map(columnReadItems, func(columItem bigtable.ReadItem, _ int) Cell {
				return toCell(columnFamily, columItem)
			})
		}
	}

	return Row{
		RowKey: row.Key(),
		Cells:  cells,
	}
}

func GetInstances(ctx context.Context, projectID string) ([]Instance, error) {
	client, err := bigtable.NewInstanceAdminClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	instances, err := client.Instances(ctx)
	if err != nil {
		return nil, err
	}

	var results []Instance
	for _, instance := range instances {
		results = append(results, *toInstance(projectID, instance))
	}
	return results, err
}

func GetInstance(ctx context.Context, projectID string, instanceId string) (*Instance, error) {
	client, err := bigtable.NewInstanceAdminClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	instance, err := client.InstanceInfo(ctx, instanceId)
	if err != nil {
		return nil, err
	}
	return toInstance(projectID, instance), nil
}

func GetTables(ctx context.Context, projectId string, instanceId string) ([]TableListItem, error) {
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

	return results, err
}

func GetTable(ctx context.Context, projectId string, instanceId string, tableId string) (*Table, error) {
	client, err := bigtable.NewAdminClient(ctx, projectId, instanceId)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	tableInfo, err := client.TableInfo(ctx, tableId)
	if err != nil {
		return nil, err
	}
	return toTable(projectId, instanceId, tableId, tableInfo), nil
}

type GetRowParams struct {
	ProjectId  string
	InstanceId string
	TableId    string
	RowPrefix  string
}

func GetRows(ctx context.Context, params GetRowParams) ([]Row, error) {
	client, err := bigtable.NewClient(ctx, params.ProjectId, params.InstanceId)
	if err != nil {
		return nil, err
	}
	defer client.Close()
	table := client.Open(params.TableId)

	var results []Row

	if err := table.ReadRows(ctx, bigtable.PrefixRange(params.RowPrefix), func(row bigtable.Row) bool {
		results = append(results, toRow(row))
		return true
	}, bigtable.LimitRows(100)); err != nil {
		return nil, err
	}

	return results, nil
}
