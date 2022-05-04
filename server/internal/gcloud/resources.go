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

func toProject(project *cloudresourcemanager.Project) *Project {
	return &Project{
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

func GetProjects(ctx context.Context) ([]Project, error) {

	client, err := cloudresourcemanager.NewService(ctx)
	if err != nil {
		return nil, err
	}

	response, err := client.Projects.List().Do()
	if err != nil {
		return nil, err
	}

	var results []Project
	for _, cloudProject := range response.Projects {
		results = append(results, *toProject(cloudProject))
	}

	return results, nil
}

func GetProject(ctx context.Context, projectId string) (*Project, error) {
	service, err := cloudresourcemanager.NewService(ctx)
	if err != nil {
		return nil, err
	}
	cloudProject, err := service.Projects.Get(projectId).Do()
	if err != nil {
		return nil, err
	}
	return toProject(cloudProject), nil
}
