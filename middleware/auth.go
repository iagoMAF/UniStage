package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		if c.FullPath() == "/swagger/*any" {
			c.Next()
			return
		}

		token := c.GetHeader("Authorization")

		if token != os.Getenv("AUTH") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Token inválido",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
