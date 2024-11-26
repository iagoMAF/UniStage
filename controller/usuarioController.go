package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iagoMAF/API_JOHARI/database"
	"github.com/iagoMAF/API_JOHARI/models"
)

// CriaUsuario godoc
// @Summary Cria um novo usuário
// @Description Cadastra um novo usuário no sistema
// @Tags Usuários
// @Accept  json
// @Produce  json
// @Param usuario body models.Usuario true "Dados do usuário"
// @Success 200 {object} models.Usuario
// @Failure 400 {object} map[string]interface{} "Falha ao cadastrar usuário"
// @Failure 500 {object} map[string]interface{} "Erro ao salvar usuário no banco de dados"
// @Router /usuarios [post]
func CriaUsuario(c *gin.Context) {
	var usuario models.Usuario

	if err := c.ShouldBindJSON(&usuario); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Falha ao processar os dados do usuário",
			"status": 400,
		})
		return
	}

	var existeUsuario models.Usuario

	if err := database.DB.Where("email = ?", usuario.Email).First(&existeUsuario).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error":  "E-mail já cadastrado",
			"status": 409,
		})
		return
	}

	usuario.DataCadastro = time.Now()

	if err := database.DB.Create(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar usuário no banco de dados",
		})
		return
	}

	c.JSON(http.StatusOK, usuario)
}

// ExibeUsuarioPorEmail godoc
// @Summary Exibe um usuário pelo e-mail
// @Description Busca um usuário pelo e-mail informado
// @Tags Usuários
// @Accept  json
// @Produce  json
// @Param email path string true "E-mail do usuário"
// @Success 200 {object} models.Usuario
// @Failure 404 {object} map[string]interface{} "Usuário não encontrado"
// @Router /usuarios/{email} [get]
func ExibeUsuarioPorEmail(c *gin.Context) {
	var usuario models.Usuario
	email := c.Param("email")

	result := database.DB.Where("email = ?", email).First(&usuario)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Usuário não encontrado",
			"status": 404,
		})
		return
	}

	c.JSON(http.StatusOK, usuario)
}

// AtualizaUsuario godoc
// @Summary Atualiza os dados de um usuário
// @Description Atualiza os dados de um usuário existente pelo ID
// @Tags Usuários
// @Accept  json
// @Produce  json
// @Param id path int true "ID do usuário"
// @Param usuario body models.Usuario true "Novos dados do usuário"
// @Success 200 {object} models.Usuario
// @Failure 400 {object} map[string]interface{} "Dados inválidos para atualização"
// @Failure 404 {object} map[string]interface{} "Usuário não encontrado"
// @Failure 500 {object} map[string]interface{} "Erro ao atualizar o usuário"
// @Router /usuarios/{id} [put]
func AtualizaUsuario(c *gin.Context) {
	var usuario models.Usuario
	id := c.Param("id")

	result := database.DB.First(&usuario, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Usuário não encontrado",
			"status": 404,
		})
		return
	}

	if err := c.ShouldBindJSON(&usuario); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Dados inválidos para atualização",
			"status": 400,
		})
		return
	}

	if err := database.DB.Save(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao atualizar o usuário",
		})
		return
	}

	c.JSON(http.StatusOK, usuario)
}

// DeletaUsuario godoc
// @Summary Deleta um usuário
// @Description Remove um usuário do sistema pelo ID
// @Tags Usuários
// @Accept  json
// @Produce  json
// @Param id path int true "ID do usuário"
// @Success 200 {object} map[string]interface{} "Usuário deletado com sucesso"
// @Failure 404 {object} map[string]interface{} "Usuário não encontrado"
// @Failure 500 {object} map[string]interface{} "Erro ao deletar o usuário"
// @Router /usuarios/{id} [delete]
func DeletaUsuario(c *gin.Context) {
	var usuario models.Usuario
	id := c.Param("id")

	result := database.DB.First(&usuario, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":  "Usuário não encontrado",
			"status": 404,
		})
		return
	}

	if err := database.DB.Delete(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao deletar o usuário",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Usuário deletado com sucesso",
	})
}

// ListaUsuarios godoc
// @Summary Lista todos os usuários
// @Description Retorna uma lista de todos os usuários cadastrados no sistema
// @Tags Usuários
// @Accept  json
// @Produce  json
// @Success 200 {array} models.Usuario "Lista de usuários"
// @Success 201 {object} map[string]interface{} "Nenhum usuário cadastrado"
// @Failure 500 {object} map[string]interface{} "Erro ao listar usuários"
// @Router /usuarios [get]
func ListaUsuarios(c *gin.Context) {
	var usuarios []models.Usuario

	if err := database.DB.Find(&usuarios).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao listar usuários",
		})
		return
	}

	if len(usuarios) == 0 {
		c.JSON(http.StatusCreated, gin.H{
			"message": "Nenhum usuário cadastrado",
		})
		return
	}

	c.JSON(http.StatusOK, usuarios)
}
