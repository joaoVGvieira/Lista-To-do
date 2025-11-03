# Projeto To-Do List

---

## Como Rodar o Projeto 

Para testar este projeto, você precisará de **dois terminais** abertos: um para o Backend e um para o Frontend.

### 1. Pré-requisitos

* Node.js (v18+ recomendado)
* Um servidor MySQL (local ou remoto)

### 2. Configuração do Backend (Terminal 1)

1.  **Crie o Banco de Dados:**
    Execute o seguinte comando no seu cliente MySQL:
    ```sql
    CREATE DATABASE todo_db;
    ```

2.  **Navegue até a pasta do backend:**
y    ```sh
    cd back 
    ```

3.  **Instale as dependências:**
    ```sh
    npm install
    ```

4.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz da pasta `back` e preencha com suas credenciais do MySQL:
    ```env
    # .env (na pasta 'back')

    DB_HOST=localhost
    DB_USER=root
    DB_PASS=sua_senha_do_mysql
    DB_NAME=todo_db
    PORT=3000
    ```

5.  **Inicie o servidor:**
    ```sh
    npm run dev
    ```
    O backend deve estar rodando em `http://localhost:3000`. O Sequelize irá criar as tabelas!!!

### 3. Configuração do Frontend (Terminal 2)

1.  **Navegue até a pasta do frontend (em um novo terminal):**
    ```sh
    cd front 
    ```

2.  **Instale as dependências:**
    ```sh
    npm install
    ```

3.  **Inicie o cliente:**
    ```sh
    npm run dev
    ```

### 4. Acessando a Aplicação

Abra seu navegador e acesse: **`http://localhost:5173`**.
