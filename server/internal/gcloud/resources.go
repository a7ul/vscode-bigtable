package gcloud

import (
	"context"

	"google.golang.org/api/cloudresourcemanager/v1"
)

type Parent struct {
	Id   string `json:"id"`
	Type string `json:"type"`
}

type Project struct {
	CreateTime     string `json:"createTime"`
	LifecycleState string `json:"lifecycleState"`
	Name           string `json:"name"`
	ProjectId      string `json:"projectId"`
	ProjectNumber  int64  `json:"projectNumber"`
	Parent         Parent `json:"parent"`
}

func toProject(project *cloudresourcemanager.Project) Project {
	return Project{
		CreateTime:     project.CreateTime,
		LifecycleState: project.LifecycleState,
		Name:           project.Name,
		ProjectId:      project.ProjectId,
		ProjectNumber:  project.ProjectNumber,
		Parent: Parent{
			Id:   project.Parent.Id,
			Type: project.Parent.Type,
		},
	}
}

func GetProjects(ctx context.Context) []Project {
	client, _ := cloudresourcemanager.NewService(ctx)
	response, _ := client.Projects.List().Do()

	var results []Project
	for _, cloudProject := range response.Projects {
		results = append(results, toProject(cloudProject))
	}

	return results
}

func GetProject(ctx context.Context, projectId string) Project {
	service, _ := cloudresourcemanager.NewService(ctx)
	cloudProject, _ := service.Projects.Get(projectId).Do()
	return toProject(cloudProject)
}
