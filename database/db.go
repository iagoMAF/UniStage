package database

import (
	"log"
	"os"

	"github.com/iagoMAF/API_JOHARI/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB  *gorm.DB
	err error
)

func ConectaDataBase() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Erro ao carregar o arquivo .env: %v", err)
	}

	urlDB := os.Getenv("DATABASE_URL")
	if urlDB == "" {
		log.Fatalf("Erro ao carregar o arquivo DATABASE_URL .env: %v", err)
	}

	stringConnection := urlDB
	DB, err = gorm.Open(postgres.Open(stringConnection))

	if err != nil {
		log.Panic("Erro ao conectar com o banco de dados.")
	}

	DB.AutoMigrate(&models.Empresa{}, &models.Usuario{},
		&models.Vaga{})
}
