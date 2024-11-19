package routes

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/iagoMAF/API_JOHARI/controller"

	"github.com/joho/godotenv"

	_ "github.com/iagoMAF/API_JOHARI/docs"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func HandleRequest() {
	r := gin.Default()
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Erro ao carregar o arquivo .env: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// r.Use(middleware.AuthMiddleware())

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// rotas de usuarios
	r.GET("/usuarios", controller.ListaUsuarios)
	r.GET("/usuarios/:email", controller.ExibeUsuarioPorEmail)
	r.PATCH("/usuarios/:id", controller.AtualizaUsuario)
	r.POST("/usuarios", controller.CriaUsuario)
	r.DELETE("/usuarios/:id", controller.DeletaUsuario)

	// rotas de empresas
	r.GET("/empresas", controller.ListaEmpresas)
	r.GET("/empresas/:cnpj", controller.ExibeEmpresaPorCNPJ)
	r.GET("/empresas/nome/:nome", controller.ExibeEmpresaPorNome)
	r.PATCH("/empresas/:cnpj", controller.AlteraEmpresa)
	r.POST("/empresas", controller.CriaEmpresa)
	r.DELETE("/empresas/:cnpj", controller.DeletaEmpresa)

	r.Run(":" + port)
}
