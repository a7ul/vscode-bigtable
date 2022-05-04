package gcloud

import (
	"context"

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

type GetInstancesParams struct {
	ProjectId string `json:"projectId" validate:"required"`
}

func GetInstances(ctx context.Context, params GetInstancesParams) ([]Instance, error) {
	if err := validate.Struct(params); err != nil {
		return nil, err
	}

	client, err := bigtable.NewInstanceAdminClient(ctx, params.ProjectId)
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
		results = append(results, *toInstance(params.ProjectId, instance))
	}
	return results, err
}

type GetInstanceParams struct {
	ProjectId  string `json:"projectId" validate:"required"`
	InstanceId string `json:"instanceId" validate:"required"`
}

func GetInstance(ctx context.Context, params GetInstanceParams) (*Instance, error) {
	if err := validate.Struct(params); err != nil {
		return nil, err
	}
	client, err := bigtable.NewInstanceAdminClient(ctx, params.ProjectId)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	instance, err := client.InstanceInfo(ctx, params.InstanceId)
	if err != nil {
		return nil, err
	}
	return toInstance(params.ProjectId, instance), nil
}

type GetTablesParams struct {
	ProjectId  string `json:"projectId" validate:"required"`
	InstanceId string `json:"instanceId" validate:"required"`
}

func GetTables(ctx context.Context, params GetTablesParams) ([]TableListItem, error) {
	if err := validate.Struct(params); err != nil {
		return nil, err
	}
	client, err := bigtable.NewAdminClient(ctx, params.ProjectId, params.InstanceId)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	tableList, err := client.Tables(ctx)

	if err != nil {
		return nil, err
	}

	var results []TableListItem
	for _, tableId := range tableList {
		results = append(results, TableListItem{
			ProjectId:  params.ProjectId,
			InstanceId: params.InstanceId,
			TableId:    tableId,
		})
	}

	return results, err
}

type GetTableParams struct {
	ProjectId  string `json:"projectId" validate:"required"`
	InstanceId string `json:"instanceId" validate:"required"`
	TableId    string `json:"tableId" validate:"required"`
}

func GetTable(ctx context.Context, params GetTableParams) (*Table, error) {
	if err := validate.Struct(params); err != nil {
		return nil, err
	}
	client, err := bigtable.NewAdminClient(ctx, params.ProjectId, params.InstanceId)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	tableInfo, err := client.TableInfo(ctx, params.TableId)
	if err != nil {
		return nil, err
	}
	return toTable(params.ProjectId, params.InstanceId, params.TableId, tableInfo), nil
}

type GetRowParams struct {
	ProjectId  string `json:"projectId" validate:"required"`
	InstanceId string `json:"instanceId" validate:"required"`
	TableId    string `json:"tableId" validate:"required"`
	RowPrefix  string `json:"rowPrefix"`
}

func GetRows(ctx context.Context, params GetRowParams) ([]Row, error) {
	if err := validate.Struct(params); err != nil {
		return nil, err
	}
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
