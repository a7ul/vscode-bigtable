package lib

import (
	"context"
	"encoding/json"

	"atulr.com/bigtable_server/internal/gcloud"
)

import "C"

// export GetProjects
func GetProjects() string {
	ctx := context.Background()
	projects := gcloud.GetProjects(ctx)
	raw, err := json.Marshal(projects)
	if err != nil {
		return err.Error()
	}
	return string(raw)
}
