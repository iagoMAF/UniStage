package main

import (
	"github.com/iagoMAF/API_JOHARI/database"
	"github.com/iagoMAF/API_JOHARI/routes"
)

func main() {
	// gin.SetMode(gin.ReleaseMode)
	database.ConectaDataBase()
	routes.HandleRequest()
}
