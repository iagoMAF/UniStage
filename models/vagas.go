package models

import (
	"time"
)

// Vaga godoc
// @Description Representa uma vaga de emprego ou estágio no sistema
// @Property ID int "Identificador único da vaga"
// @Property Titulo string "Título da vaga (ex.: 'Estágio em Desenvolvimento Web')"
// @Property Descricao string "Descrição detalhada da vaga"
// @Property Requisitos string "Requisitos necessários para a vaga"
// @Property Beneficios string "Benefícios oferecidos pela vaga"
// @Property ConhecimentoDif string "Habilidades necessárias para a vaga"
// @Property CargaHoraria string "Informações sobre a carga horária (ex.: '20h/semana')"
// @Property Remuneracao string "Valor da bolsa ou remuneração, se aplicável"
// @Property EstagioRemoto int "Indica se a vaga é remota (1), presencial (0), ou híbrida (2)"
// @Property Cidade string "Cidade ou local de trabalho"
// @Property UF string "Estado"
// @Property Logradouro string "Rua do endereço"
// @Property Numero string "Número do local"
// @Property Bairro string "Bairro do local"
// @Property EmpresaCNPJ string "Chave estrangeira para a empresa que criou a vaga"
// @Property Ativo bool "Indica se a vaga está ativa e visível no sistema"
// @Property DataPublicacao time.Time "Data e hora de publicação da vaga"
// @Property DataExpiracao time.Time "Data e hora em que a vaga expira, caso aplicável"
// @Property Empresa Empresa "Informações sobre a empresa associada à vaga"
// Vaga model
type Vaga struct {
	ID              int        `gorm:"primaryKey;autoIncrement" json:"id"`
	Titulo          string     `gorm:"type:varchar(255);not null" json:"titulo"`
	Descricao       string     `gorm:"type:text;not null" json:"descricao"`
	Requisitos      string     `gorm:"type:text" json:"requisitos"`
	Beneficios      string     `gorm:"type:text" json:"beneficios"`
	ConhecimentoDif string     `gorm:"type:text" json:"conhecimento_dif"`
	CargaHoraria    string     `gorm:"type:varchar(50)" json:"carga_horaria"`
	Remuneracao     string     `gorm:"type:varchar(50)" json:"remuneracao"`
	EstagioRemoto   int        `gorm:"type:int;not null" json:"estagio_remoto"`
	Cidade          string     `gorm:"type:varchar(255);not null" json:"cidade"`
	UF              string     `gorm:"type:varchar(2);not null" json:"uf"`
	Logradouro      string     `gorm:"type:varchar(255)" json:"logradouro"`
	Numero          string     `gorm:"type:varchar(10)" json:"numero"`
	Bairro          string     `gorm:"type:varchar(255)" json:"bairro"`
	EmpresaCNPJ     string     `gorm:"type:varchar(18);not null" json:"empresa_cnpj"`
	Ativo           bool       `gorm:"default:true" json:"ativo"`
	DataPublicacao  time.Time  `gorm:"autoCreateTime" json:"data_publicacao"`
	DataExpiracao   *time.Time `gorm:"type:timestamp" json:"data_expiracao,omitempty"`

	Empresa Empresa `gorm:"foreignKey:EmpresaCNPJ;references:CNPJ" json:"empresa"`
}
