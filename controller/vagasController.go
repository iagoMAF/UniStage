package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iagoMAF/API_JOHARI/database"
	"github.com/iagoMAF/API_JOHARI/models"
)

// CriaVaga godoc
// @Summary Cria uma nova vaga
// @Description Cadastra uma nova vaga no sistema
// @Tags Vagas
// @Accept  json
// @Produce  json
// @Param vaga body models.Vaga true "Dados da vaga"
// @Success 200 {object} models.Vaga
// @Failure 400 {object} map[string]interface{} "Falha ao cadastrar vaga"
// @Failure 500 {object} map[string]interface{} "Erro ao salvar vaga no banco de dados"
// @Router /vagas [post]
func CriaVaga(c *gin.Context) {
	var vaga models.Vaga

	if err := c.ShouldBindJSON(&vaga); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Falha ao processar os dados da vaga",
			"status": 400,
		})
		return
	}

	vaga.DataPublicacao = time.Now()

	if err := database.DB.Create(&vaga).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar vaga no banco de dados",
		})
		return
	}

	c.JSON(http.StatusOK, vaga)
}

// ExibeVagaPorID godoc
// @Summary Exibe uma vaga pelo ID
// @Description Busca uma vaga pelo ID informado
// @Tags Vagas
// @Accept  json
// @Produce  json
// @Param id path int true "ID da vaga"
// @Success 200 {object} models.Vaga
// @Failure 404 {object} map[string]interface{} "Vaga não encontrada"
// @Router /vagas/{id} [get]
func ExibeVagaPorID(c *gin.Context) {
	var vaga models.Vaga
	id := c.Param("id")

	result := database.DB.Preload("Empresa").First(&vaga, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Vaga não encontrada",
			"status": 404,
		})
		return
	}

	c.JSON(http.StatusOK, vaga)
}

// AtualizaVaga godoc
// @Summary Atualiza os dados de uma vaga
// @Description Atualiza os dados de uma vaga existente pelo ID
// @Tags Vagas
// @Accept  json
// @Produce  json
// @Param id path int true "ID da vaga"
// @Param vaga body models.Vaga true "Novos dados da vaga"
// @Success 200 {object} models.Vaga
// @Failure 400 {object} map[string]interface{} "Dados inválidos para atualização"
// @Failure 404 {object} map[string]interface{} "Vaga não encontrada"
// @Failure 500 {object} map[string]interface{} "Erro ao atualizar a vaga"
// @Router /vagas/{id} [put]
func AtualizaVaga(c *gin.Context) {
	var vaga models.Vaga
	id := c.Param("id")

	result := database.DB.First(&vaga, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Vaga não encontrada",
			"status": 404,
		})
		return
	}

	if err := c.ShouldBindJSON(&vaga); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Dados inválidos para atualização",
			"status": 400,
		})
		return
	}

	if err := database.DB.Save(&vaga).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao atualizar a vaga",
		})
		return
	}

	c.JSON(http.StatusOK, vaga)
}

// DeletaVaga godoc
// @Summary Deleta uma vaga
// @Description Remove uma vaga do sistema pelo ID
// @Tags Vagas
// @Accept  json
// @Produce  json
// @Param id path int true "ID da vaga"
// @Success 200 {object} map[string]interface{} "Vaga deletada com sucesso"
// @Failure 404 {object} map[string]interface{} "Vaga não encontrada"
// @Failure 500 {object} map[string]interface{} "Erro ao deletar a vaga"
// @Router /vagas/{id} [delete]
func DeletaVaga(c *gin.Context) {
	var vaga models.Vaga
	id := c.Param("id")

	result := database.DB.First(&vaga, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Vaga não encontrada",
			"status": 404,
		})
		return
	}

	if err := database.DB.Delete(&vaga).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao deletar a vaga",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vaga deletada com sucesso",
	})
}

// ListaVagas godoc
// @Summary Lista todas as vagas
// @Description Retorna uma lista de todas as vagas cadastradas no sistema
// @Tags Vagas
// @Accept  json
// @Produce  json
// @Success 200 {array} models.Vaga "Lista de vagas"
// @Failure 500 {object} map[string]interface{} "Erro ao listar vagas"
// @Router /vagas [get]
func ListaVagas(c *gin.Context) {
	var vagas []models.Vaga

	if err := database.DB.Preload("Empresa").Find(&vagas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao listar vagas",
		})
		return
	}

	if len(vagas) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Nenhuma vaga cadastrada",
		})
		return
	}

	c.JSON(http.StatusOK, vagas)
}

// ListaVagasPorCNPJ godoc
// @Summary Lista todas as vagas associadas a um CNPJ
// @Description Retorna uma lista de todas as vagas associadas ao CNPJ da empresa
// @Tags Vagas
// @Accept  json
// @Produce  json
// @Param cnpj path string true "CNPJ da empresa"
// @Success 200 {array} models.Vaga "Lista de vagas associadas ao CNPJ"
// @Failure 404 {object} map[string]interface{} "Nenhuma vaga encontrada para o CNPJ"
// @Failure 500 {object} map[string]interface{} "Erro ao listar vagas"
// @Router /vagas/cnpj/{cnpj} [get]
func ListaVagasPorCNPJ(c *gin.Context) {
	cnpj := c.Param("cnpj")

	var vagas []models.Vaga

	if err := database.DB.Preload("Empresa").Where("empresa_cnpj = ?", cnpj).Find(&vagas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao listar vagas",
		})
		return
	}

	if len(vagas) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Nenhuma vaga encontrada para o CNPJ",
			"status": 404,
		})
		return
	}

	c.JSON(http.StatusOK, vagas)
}

// ExibeVagaComEmpresa godoc
// @Summary Exibe uma vaga pelo ID com a empresa associada
// @Description Busca uma vaga pelo ID e carrega a empresa associada
// @Tags Vagas
// @Accept  json
// @Produce  json
// @Param id path int true "ID da vaga"
// @Success 200 {object} models.Vaga "Vaga com a empresa associada"
// @Failure 404 {object} map[string]interface{} "Vaga não encontrada"
// @Failure 500 {object} map[string]interface{} "Erro ao listar vaga"
// @Router /vagas/empresa/{id} [get]
func ExibeVagaComEmpresa(c *gin.Context) {
	var vaga models.Vaga
	id := c.Param("id")

	result := database.DB.Preload("Empresa").First(&vaga, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Vaga não encontrada",
			"status": 404,
		})
		return
	}

	if vaga.Empresa.CNPJ == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Empresa associada à vaga não encontrada",
			"status": 404,
		})
		return
	}

	c.JSON(http.StatusOK, vaga)
}
