package models

import (
	"time"
)

// Empresa godoc
// @Description Representa uma empresa cadastrada no sistema
// @Property CNPJ string "Cadastro Nacional de Pessoa Jurídica, único"
// @Property RazaoSocial string "Razão social da empresa"
// @Property NomeFantasia string "Nome fantasia da empresa (opcional)"
// @Property Descricao string "Breve descrição sobre a empresa"
// @Property Email string "E-mail da empresa, único, para login e notificações"
// @Property Telefone string "Telefone de contato da empresa"
// @Property AreaDeAtuacao string "Segmento no qual a empresa trabalha"
// @Property Ativo bool "Indica se a empresa está ativa no sistema"
// @Property DataCadastro time.Time "Data e hora do cadastro no sistema"
// @Property Cidade string "Cidade ou local de trabalho"
// @Property UF string "Estado"
// @Property Logradouro string "Rua do endereço"
// @Property Numero string "Número do local"
// @Property Bairro string "Bairro do local"
// @Property Website string "URL do site oficial da empresa (opcional)"
type Empresa struct {
	CNPJ          string    `gorm:"primaryKey;type:varchar(18);not null" json:"cnpj"`
	RazaoSocial   string    `gorm:"type:varchar(255);not null" json:"razao_social"`
	NomeFantasia  *string   `gorm:"type:varchar(255)" json:"nome_fantasia,omitempty"`
	Descricao     *string   `gorm:"type:text" json:"descricao,omitempty"`
	Email         string    `gorm:"type:varchar(255);unique;not null" json:"email"`
	Telefone      string    `gorm:"type:varchar(20);not null" json:"telefone"`
	AreaDeAtuacao string    `gorm:"type:varchar(255);not null" json:"area_de_atuacao"`
	Ativo         bool      `gorm:"default:true" json:"ativo"`
	DataCadastro  time.Time `gorm:"autoCreateTime" json:"data_cadastro"`
	Cidade        string    `gorm:"type:varchar(255);not null" json:"cidade"`
	UF            string    `gorm:"type:varchar(2);not null" json:"uf"`
	Logradouro    string    `gorm:"type:varchar(255);not null" json:"logradouro"`
	Numero        string    `gorm:"type:varchar(10);not null" json:"numero"`
	Bairro        string    `gorm:"type:varchar(255);not null" json:"bairro"`
	Website       *string   `gorm:"type:varchar(255)" json:"website,omitempty"`
	Senha         string    `gorm:"type:varchar(255);not null" json:"senha"`
}

// Tabela auxiliar para armazenar múltiplas empresas
var Empresas []Empresa
