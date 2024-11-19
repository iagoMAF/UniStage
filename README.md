# API-Janela Johari

A API para a aplicação do teste da Janela de Johari foi desenvolvida em GoLang, permitindo a consulta, inserção e atualização de informações dos atletas e dos testes aplicados. Com relação ao ORM GORM foi utilizado para a gestão do banco de dados, enquanto o framework GIN foi escolhido para estruturar as rotas da aplicação.

## **Descrição do projeto**

A API da Janela de Johari é um sistema que permite aos usuários consultar, inserir e atualizar informações relacionadas aos atletas e aos testes da Janela de Johari. Essa API oferece um serviço para gerenciar dados dos atletas e os resultados dos testes aplicados, possibilitando a análise de autopercepção e percepção externa. Além disso, inclui informações detalhadas sobre cada atleta e os respectivos testes, como a equipe associada e o status de participação.

## **Uso do projeto**

[Certifique-se de que esteja utuilizando a versão "1.21.8" do GoLang](https://go.dev/doc/devel/release#go1.21.minor). Caso necessário utilize os seguintes comandos na pasta raiz do projeto:

**Comando da biblioteca para usar o uuid:**

`go get -u github.com/google/uuid`

**Comando da instalar as dependências necessárias para as variáveis de ambiente:**

`go get github.com/joho/godotenv`

**Além das dependências do projeto, é necessário criar e configurar um arquivo `.env` na raiz do projeto. Este arquivo contém informações sensíveis, como a DATABASE_URL da base de dados, , a  variável PORT referente a porta em que o serviço vai rodar, a variável AUTH referente a autentificação da aplicação.**

1. Crie um arquivo `.env` na raiz do projeto se ele ainda não existir.

2. Abra o arquivo `.env` em um editor de texto de sua escolha.

3. Defina as variáveis de ambiente necessárias no formato `VARIAVEL="valor"`. Aqui está um exemplo de configuração inicial (caso necessario utilize como base o [arquivo](./.env.example)):

```plaintext
   URL="URL_API_EXTERNA"
   PORT="3000"
   AUTH="TESTE"
```

Com relação a configuração do banco de dados, é possivel utilizar o [docker-compose.yml](./.docker-compose.yml), para isso, é necessário ter instalado o Docker Desktop. É necessario preencher as variáveis de ambiente.

**Swagger / Documentação**

O swagger foi gerado de forma automática através da [documentação](https://github.com/swaggo/swag). Caso seja necessário gerar uma nova documentação, é possível utilizar o comando:

`swag init`

O comando pode não funcionar por alguns motivos:

1. Swag Não Instalado - Certifique-se de que o pacote Swag está instalado em seu ambiente Go. Você pode instalá-lo utilizando o seguinte comando:

`go get -u github.com/swaggo/swag/cmd/swag`

2. Problemas de Dependências - Certifique-se de que suas dependências estão corretamente instaladas e atualizadas. Execute `go mod tidy` para garantir que todas as dependências estejam no estado correto.

Para rodar a aplicação é necessário utilizar o comando:

`go run main.go`