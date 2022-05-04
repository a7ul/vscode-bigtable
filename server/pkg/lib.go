package main

import "C"
import (
	"context"
	"unsafe"

	"atulr.com/bigtable_server/internal/gcloud"
	"atulr.com/bigtable_server/internal/helpers"
)

//export GetProjects
func GetProjects(rawParams *C.char, cb unsafe.Pointer) {
	parse := helpers.CreateParser(cb, C.GoString(rawParams), struct{}{})
	onParse := func(params struct{}, callback helpers.Callback) {
		ctx := context.Background()
		callback(gcloud.GetProjects(ctx))
	}
	parse(onParse)
}

//export GetProject
func GetProject(rawParams *C.char, cb unsafe.Pointer) {
	parse := helpers.CreateParser(cb, C.GoString(rawParams), gcloud.GetProjectParams{})
	onParse := func(params gcloud.GetProjectParams, callback helpers.Callback) {
		ctx := context.Background()
		callback(gcloud.GetProject(ctx, params))
	}
	parse(onParse)
}

//export GetInstances
func GetInstances(rawParams *C.char, cb unsafe.Pointer) {
	parse := helpers.CreateParser(cb, C.GoString(rawParams), gcloud.GetInstancesParams{})
	onParse := func(params gcloud.GetInstancesParams, callback helpers.Callback) {
		ctx := context.Background()
		callback(gcloud.GetInstances(ctx, params))
	}
	parse(onParse)
}

//export GetInstance
func GetInstance(rawParams *C.char, cb unsafe.Pointer) {
	parse := helpers.CreateParser(cb, C.GoString(rawParams), gcloud.GetInstanceParams{})
	onParse := func(params gcloud.GetInstanceParams, callback helpers.Callback) {
		ctx := context.Background()
		callback(gcloud.GetInstance(ctx, params))
	}
	parse(onParse)
}

//export GetTables
func GetTables(rawParams *C.char, cb unsafe.Pointer) {
	parse := helpers.CreateParser(cb, C.GoString(rawParams), gcloud.GetTablesParams{})
	onParse := func(params gcloud.GetTablesParams, callback helpers.Callback) {
		ctx := context.Background()
		callback(gcloud.GetTables(ctx, params))
	}
	parse(onParse)
}

//export GetTable
func GetTable(rawParams *C.char, cb unsafe.Pointer) {
	parse := helpers.CreateParser(cb, C.GoString(rawParams), gcloud.GetTableParams{})
	onParse := func(params gcloud.GetTableParams, callback helpers.Callback) {
		ctx := context.Background()
		callback(gcloud.GetTable(ctx, params))
	}
	parse(onParse)
}

//export GetRows
func GetRows(rawParams *C.char, cb unsafe.Pointer) {
	parse := helpers.CreateParser(cb, C.GoString(rawParams), gcloud.GetRowParams{})
	onParse := func(params gcloud.GetRowParams, callback helpers.Callback) {
		ctx := context.Background()
		callback(gcloud.GetRows(ctx, params))
	}
	parse(onParse)
}

func main() {}
