package models

import (
	"time"
)

// Usuario godoc
// @Description Representa um usuário do sistema
// @Property ID int "Identificador único do usuário"
// @Property Nome string "Nome do usuário"
// @Property Email string "E-mail do usuário, deve ser único"
// @Property Senha string "Senha criptografada para login"
// @Property EmpresaCNPJ string "Chave estrangeira opcional para a tabela Empresas"
// @Property TipoUsuario bool "Tipo do usuário: true para ADMIN, false para EMPRESA"
// @Property Ativo bool "Indica se o usuário está ativo no sistema"
// @Property DataCadastro time.Time "Data e hora do cadastro no sistema"
type Usuario struct {
	ID           int       `gorm:"primaryKey;autoIncrement" json:"id"`
	Nome         string    `gorm:"type:varchar(255);not null" json:"nome"`
	Email        string    `gorm:"type:varchar(255);unique;not null" json:"email"`
	Senha        string    `gorm:"type:varchar(255);not null" json:"senha"`
	EmpresaCNPJ  *string   `gorm:"type:varchar(18)" json:"empresa_cnpj,omitempty"` // Chave estrangeira opcional
	TipoUsuario  bool      `gorm:"not null" json:"tipo_usuario"`                   // true = ADMIN, false = EMPRESA
	Ativo        bool      `gorm:"default:true" json:"ativo"`
	DataCadastro time.Time `gorm:"autoCreateTime" json:"data_cadastro"`
}

// Tabela auxiliar para armazenar múltiplos usuários
var Usuarios []Usuario
