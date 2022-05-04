package main

import (
	"atulr.com/bigtable_server/internal/gcloud"
	"atulr.com/bigtable_server/internal/helpers"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.GET("/ping", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		return gin.H{"message": "pong"}, nil
	}))

	router.GET("/projects", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		return gcloud.GetProjects(ctx)
	}))

	router.GET("/projects/:projectId", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		projectId, _ := ctx.Params.Get("projectId")
		return gcloud.GetProject(ctx, gcloud.GetProjectParams{
			ProjectId: projectId,
		})
	}))

	router.GET("/projects/:projectId/instances", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		projectId, _ := ctx.Params.Get("projectId")
		return gcloud.GetInstances(ctx, gcloud.GetInstancesParams{
			ProjectId: projectId,
		})

	}))

	router.GET("/projects/:projectId/instances/:instanceId", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		projectId, _ := ctx.Params.Get("projectId")
		instanceId, _ := ctx.Params.Get("instanceId")
		return gcloud.GetInstance(ctx, gcloud.GetInstanceParams{
			ProjectId:  projectId,
			InstanceId: instanceId,
		})
	}))
	router.GET("/projects/:projectId/instances/:instanceId/tables", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		projectId, _ := ctx.Params.Get("projectId")
		instanceId, _ := ctx.Params.Get("instanceId")
		return gcloud.GetTables(ctx, gcloud.GetTablesParams{
			ProjectId:  projectId,
			InstanceId: instanceId,
		})
	}))

	router.GET("/projects/:projectId/instances/:instanceId/tables/:tableId", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		projectId, _ := ctx.Params.Get("projectId")
		instanceId, _ := ctx.Params.Get("instanceId")
		tableId, _ := ctx.Params.Get("tableId")
		return gcloud.GetTable(ctx, gcloud.GetTableParams{
			ProjectId:  projectId,
			InstanceId: instanceId,
			TableId:    tableId,
		})
	}))

	router.GET("/projects/:projectId/instances/:instanceId/tables/:tableId/rows", helpers.RouteHandler(func(ctx *gin.Context) (any, error) {
		projectId, _ := ctx.Params.Get("projectId")
		instanceId, _ := ctx.Params.Get("instanceId")
		tableId, _ := ctx.Params.Get("tableId")
		rowPrefix, _ := ctx.GetQuery("rowPrefix")

		return gcloud.GetRows(ctx, gcloud.GetRowParams{
			ProjectId:  projectId,
			InstanceId: instanceId,
			TableId:    tableId,
			RowPrefix:  rowPrefix,
		})
	}))

	router.Run(":8080")
}
