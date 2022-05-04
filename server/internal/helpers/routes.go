package helpers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RouteHandler(handler func(*gin.Context) (any, error)) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		value, err := handler(ctx)
		if err != nil {
			ctx.AbortWithError(http.StatusInternalServerError, err)
		} else {
			ctx.JSON(http.StatusOK, value)
		}
	}
}
