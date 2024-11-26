package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iagoMAF/API_JOHARI/database"
	"github.com/iagoMAF/API_JOHARI/models"
)

// CriaEmpresa godoc
// @Summary Cria uma nova empresa
// @Description Cadastra uma nova empresa no sistema
// @Tags Empresas
// @Accept  json
// @Produce  json
// @Param empresa body models.Empresa true "Dados da empresa"
// @Success 200 {object} models.Empresa
// @Failure 400 {object} map[string]interface{} "Falha ao cadastrar empresa"
// @Failure 500 {object} map[string]interface{} "Erro ao salvar empresa no banco de dados"
// @Router /empresas [post]
func CriaEmpresa(c *gin.Context) {
	var empresa models.Empresa

	if err := c.ShouldBindJSON(&empresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Falha ao processar os dados da empresa",
			"status": 400,
		})
		return
	}

	var existingCNPJ models.Empresa
	if err := database.DB.Where("cnpj = ?", empresa.CNPJ).First(&existingCNPJ).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error":  "CNPJ já cadastrado",
			"status": 400,
		})
		return
	}

	var existingEmail models.Empresa
	if err := database.DB.Where("email = ?", empresa.Email).First(&existingEmail).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error":  "E-mail já cadastrado",
			"status": 409,
		})
		return
	}

	empresa.DataCadastro = time.Now()

	if err := database.DB.Create(&empresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar empresa no banco de dados",
		})
		return
	}

	c.JSON(http.StatusOK, empresa)
}

// ExibeEmpresaPorCNPJ godoc
// @Summary Exibe uma empresa pelo CNPJ
// @Description Busca uma empresa pelo CNPJ informado
// @Tags Empresas
// @Accept  json
// @Produce  json
// @Param cnpj path string true "CNPJ da empresa"
// @Success 200 {object} models.Empresa
// @Failure 404 {object} map[string]interface{} "Empresa não encontrada"
// @Router /empresas/{cnpj} [get]
func ExibeEmpresaPorCNPJ(c *gin.Context) {
	var empresa models.Empresa
	cnpj := c.Param("cnpj")

	result := database.DB.Where("cnpj = ?", cnpj).First(&empresa)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Empresa não encontrada",
			"status": 404,
		})
		return
	}

	c.JSON(http.StatusOK, empresa)
}

// GET /empresas/nome/:nome
// @Summary Exibe informações de uma empresa pelo nome
// @Description Retorna os dados de uma empresa com base no nome
// @Tags Empresas
// @Accept  json
// @Produce  json
// @Param nome path string true "Nome da empresa"
// @Success 200 {object} models.Empresa
// @Failure 404 {object} map[string]interface{} "Empresa não encontrada"
// @Router /empresas/nome/{nome} [get]
func ExibeEmpresaPorNome(c *gin.Context) {
	var empresa models.Empresa
	nome := c.Param("nome")

	// Verifica se o nome é vazio ou nulo
	if nome == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Nome da empresa não pode ser vazio",
			"status": 400,
		})
		return
	}

	// Busca a empresa pelo nome, tratando caso o nome_fantasia seja nil
	result := database.DB.Where("nome_fantasia LIKE ?", "%"+nome+"%").First(&empresa)
	if result.Error != nil {
		// Verifica se a empresa foi encontrada ou não
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Empresa não encontrada",
			"status": 404,
		})
		return
	}

	// Retorna a empresa encontrada
	c.JSON(http.StatusOK, empresa)
}

// ListaEmpresas godoc
// @Summary Lista todas as empresas
// @Description Retorna uma lista de todas as empresas cadastradas no sistema
// @Tags Empresas
// @Accept  json
// @Produce  json
// @Success 200 {array} models.Empresa "Lista de empresas"
// @Success 201 {object} map[string]interface{} "Nenhuma empresa cadastrada"
// @Failure 500 {object} map[string]interface{} "Erro ao listar empresas"
// @Router /empresas [get]
func ListaEmpresas(c *gin.Context) {
	var empresas []models.Empresa

	if err := database.DB.Find(&empresas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao listar empresas",
		})
		return
	}

	if len(empresas) == 0 {
		c.JSON(http.StatusCreated, gin.H{
			"message": "Nenhuma empresa cadastrada",
		})
		return
	}

	c.JSON(http.StatusOK, empresas)
}

// AlteraEmpresa godoc
// @Summary Altera os dados de uma empresa existente
// @Description Atualiza as informações de uma empresa no sistema
// @Tags Empresas
// @Accept  json
// @Produce  json
// @Param cnpj path string true "CNPJ da empresa"
// @Param empresa body models.Empresa true "Dados atualizados da empresa"
// @Success 200 {object} models.Empresa
// @Failure 400 {object} map[string]interface{} "Falha ao processar os dados da empresa"
// @Failure 404 {object} map[string]interface{} "Empresa não encontrada"
// @Failure 500 {object} map[string]interface{} "Erro ao atualizar a empresa"
// @Router /empresas/{cnpj} [put]
func AlteraEmpresa(c *gin.Context) {
	var empresa models.Empresa
	cnpj := c.Param("cnpj")

	// Verifica se a empresa existe
	result := database.DB.Where("cnpj = ?", cnpj).First(&empresa)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Empresa não encontrada",
			"status": 404,
		})
		return
	}

	// Atualiza os dados com os dados recebidos no body
	if err := c.ShouldBindJSON(&empresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Falha ao processar os dados da empresa",
			"status": 400,
		})
		return
	}

	// Atualiza os campos da empresa
	if err := database.DB.Save(&empresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao atualizar empresa no banco de dados",
		})
		return
	}

	c.JSON(http.StatusOK, empresa)
}

// DeletaEmpresa godoc
// @Summary Deleta uma empresa
// @Description Exclui uma empresa do sistema pelo CNPJ
// @Tags Empresas
// @Accept  json
// @Produce  json
// @Param cnpj path string true "CNPJ da empresa"
// @Success 200 {object} map[string]interface{} "Empresa excluída com sucesso"
// @Failure 404 {object} map[string]interface{} "Empresa não encontrada"
// @Failure 500 {object} map[string]interface{} "Erro ao deletar a empresa"
// @Router /empresas/{cnpj} [delete]
func DeletaEmpresa(c *gin.Context) {
	var empresa models.Empresa
	cnpj := c.Param("cnpj")

	// Verifica se a empresa existe
	result := database.DB.Where("cnpj = ?", cnpj).First(&empresa)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Empresa não encontrada",
			"status": 404,
		})
		return
	}

	// Deleta a empresa
	if err := database.DB.Delete(&empresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao deletar empresa no banco de dados",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Empresa excluída com sucesso",
	})
}
