 <img src="https://img.shields.io/github/license/Ricnaga/nodejs-unit-test?label=License&style=for-the-badge"/>


# <div align="center"> Desafio NodeJS - testes unitários </div>

#### <div align="right">- Projeto Finalizado <div>

### <div align="center"> Desafio de curso criado pela equipe Rocketseat abordando conceitos sobre: </div>

#### - CRUD com ExpressJS
#### - Tipos de dados de requisições
#### - Tipos de dados de retornos
#### - Json Web token
#### - Encriptação de senha com bcrypt
#### - Testes unitários


## <div align="center"> Sumário </div>
<!--ts-->
   - [Requisitos](#<div-align="center">Requisitos</div>)
   - [Tecnologias utilizadas](#<div-align="center">Tecnologias-utilizadas</div>)
<!--te-->

## <div align="center">Requisitos</div>
Para executar a aplicação é necessário instalar algumas ferramentas tais como um editor de códigos para realizar compilação dos mesmos. Nesse projeto foi utilizado o [Visual Studio Code](https://code.visualstudio.com/), [NodeJS](https://nodejs.org/en/) para compilação do código, [Git Bash](https://gitforwindows.org/) para baixar o repositório e baixar todas as dependências necessárias.
precisará também baixar o [Docker](https://www.docker.com/products/docker-desktop) para instalar de forma automática o banco de dados

```bash
# Baixe o repositório.
$ git clone https://github.com/Ricnaga/nodejs-unit-test.git

# Acesse a pasta do projeto.
$ cd nodejs-unit-test

# Agora que baixou e acessou o repositório, vamos começar a instalação das dependências.
$ yarn ( caso não utilize o yarn execute apenas npm -i)

# Caso queira, utilize o docker para iniciar o banco de dados postgres ou instale diretamente
# Usuário, senha e nome do banco estão no arquivo ormconfig
$ docker compose up

# Depois de instalado todas as dependências, abra a aplicação via vscode
$ code .

# Agore execute a aplicação.
$ yarn test
```

##  <div align="center">Tecnologias utilizadas</div>
- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/starter/installing.html)
- [Docker](https://www.docker.com/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt/)
- [JWT](https://jwt.io//)
- [Supertest](https://www.npmjs.com/package/supertest/)


## <div align="center">Autor</div>
<div align="center">Atividade desenvolvida no curso ignite pela equipe <a href="https://rocketseat.com.br/">Rocketseat</a>, realizados por minha pessoa.
Gostou? tem alguma sugestão de melhoria? por favor, entre em contato e ja aproveita e me adiciona.<br>
<a href="https://www.linkedin.com/in/ricardo-nagatomy"><img src="https://img.shields.io/badge/-RicardoNaga-blue?style=flat-square&logo=Linkedin&logoColor=white"></a>
<a href="https://app.rocketseat.com.br/me/ricardo-nagatomy"><img src="https://img.shields.io/badge/-Rocketseat-000?style=flat-square&logo=&logoColor=white"></a>
</div>
