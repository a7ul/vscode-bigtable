package main

import (
	"net/http"

	"atulr.com/vscode/gcloud"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	router.GET("/projects", func(ctx *gin.Context) {
		projects := gcloud.GetProjects(ctx)
		ctx.JSON(http.StatusOK, projects)
	})

	router.GET("/projects/:projectId", func(ctx *gin.Context) {
		projectId, _ := ctx.Params.Get("projectId")
		project := gcloud.GetProject(ctx, projectId)
		ctx.JSON(http.StatusOK, project)
	})

	router.GET("/projects/:projectId/instances", func(ctx *gin.Context) {
		projectId, _ := ctx.Params.Get("projectId")
		instances := gcloud.GetInstances(ctx, projectId)
		ctx.JSON(http.StatusOK, instances)
	})

	router.GET("/projects/:projectId/instances/:instanceId", func(ctx *gin.Context) {
		projectId, _ := ctx.Params.Get("projectId")
		instanceId, _ := ctx.Params.Get("instanceId")
		instance := gcloud.GetInstance(ctx, projectId, instanceId)
		ctx.JSON(http.StatusOK, instance)
	})
	router.GET("/projects/:projectId/instances/:instanceId/tables", func(ctx *gin.Context) {
		projectId, _ := ctx.Params.Get("projectId")
		instanceId, _ := ctx.Params.Get("instanceId")
		tables := gcloud.GetTables(ctx, projectId, instanceId)
		ctx.JSON(http.StatusOK, tables)
	})

	router.GET("/projects/:projectId/instances/:instanceId/tables/:tableId", func(ctx *gin.Context) {
		projectId, _ := ctx.Params.Get("projectId")
		instanceId, _ := ctx.Params.Get("instanceId")
		tableId, _ := ctx.Params.Get("tableId")
		table := gcloud.GetTable(ctx, projectId, instanceId, tableId)
		ctx.JSON(http.StatusOK, table)
	})
	router.Run(":8080")
}
