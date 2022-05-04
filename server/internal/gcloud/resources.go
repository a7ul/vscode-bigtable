package gcloud

import (
	"context"

	"github.com/go-playground/validator/v10"
	"google.golang.org/api/cloudresourcemanager/v1"
)

// use a single instance of Validate, it caches struct info
var validate = validator.New()

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

type GetProjectParams struct {
	ProjectId string `json:"projectId" validate:"required"`
}

func GetProject(ctx context.Context, params GetProjectParams) (*Project, error) {
	if err := validate.Struct(params); err != nil {
		return nil, err
	}
	service, err := cloudresourcemanager.NewService(ctx)
	if err != nil {
		return nil, err
	}
	cloudProject, err := service.Projects.Get(params.ProjectId).Do()
	if err != nil {
		return nil, err
	}
	return toProject(cloudProject), nil
}
