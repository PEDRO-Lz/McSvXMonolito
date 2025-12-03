# Projeto Comparativo: Monolito vs Microserviços com Docker

Este projeto compara o desempenho de uma API Node.js em diferentes arquiteturas, utilizando arquivo JSON e banco de dados MySQL como persistência. O objetivo é demonstrar as diferenças entre um sistema monolítico (bare metal) e uma arquitetura baseada em microserviços utilizando Docker e Docker Compose.  

## Estrutura do Projeto

- **MonolitoNode/**  
  API monolítica para testes locais (bare metal), podendo persistir em arquivo JSON ou MySQL.
- **MicServices/**  
  Microserviços separados (register, login, profile), cada um em seu próprio container Docker.
- **mysql.sh**  
  Script para subir o container MySQL, criando o banco e tabela automaticamente.
- **docker-composeNetdata.yml**  
  Configura e sobe o container Netdata para monitoramento de recursos do host e dos containers.

## Branches

- **main**  
  Versão principal para testes com persistência em MySQL.
- **localDB.json**  
  Versão para testes com persistência em arquivo JSON (`users.json`), em vez do banco relacional.

## Como Subir os Containers

### 1. MySQL (Banco de Dados)
No diretório raiz:
```bash
chmod +x mysql.sh
./mysql.sh
```
Cria e inicia o container `meu-mysql` com o banco `usersdb`.

### 2. Microserviços (register, login, profile)
No diretório `MicServices/`:
```bash
docker-compose up --build
```
Os três serviços (register, login, profile) serão construídos e inicializados em containers Docker.

### 3. Monitoramento (Netdata)
No diretório raiz:
```bash
docker-compose -f docker-composeNetdata.yml up -d
```
Acesse o painel de monitoramento em: [http://localhost:19999](http://localhost:19999)

## Rodar Monolito (Bare Metal)

Para testar a API monolítica no host (sem containers), execute:
```bash
cd MonolitoNode/
npm install
node index.js
```

## Teste com JSON Local

Para realizar os testes utilizando apenas o arquivo JSON como persistência, troque para a branch específica:
```bash
git checkout localDB.json
```
Siga os mesmos passos para subir os containers ou rodar o Monolito.