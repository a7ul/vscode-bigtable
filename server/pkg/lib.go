package main

import "C"
import (
	"context"
	"unsafe"

	"atulr.com/bigtable_server/internal/gcloud"
	"atulr.com/bigtable_server/internal/helpers"
)

//export GetProjects
func GetProjects(cb unsafe.Pointer) {
	callback := helpers.GetCallbackExecutor(cb)
	ctx := context.Background()
	callback(gcloud.GetProjects(ctx))
}

//export GetProject
func GetProject(project *C.char, cb unsafe.Pointer) {
	callback := helpers.GetCallbackExecutor(cb)
	ctx := context.Background()
	callback(gcloud.GetProject(ctx, C.GoString(project)))
}

func main() {}
