# Instruções para Hospedagem Interna

Este projeto foi preparado para ser exportado e hospedado em um ambiente interno (servidor próprio, VPS, etc.).

## Pré-requisitos

- **Node.js**: Versão 18 ou superior instalada.
- **NPM**: Gerenciador de pacotes do Node.js.

## Passos para Instalação

1. **Extrair os arquivos**: Copie todos os arquivos do projeto para a pasta de destino no servidor.
2. **Instalar dependências**:
   ```bash
   npm install
   ```
3. **Configurar variáveis de ambiente**:
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edite o arquivo `.env` com as configurações desejadas (Porta, Senha, etc.).
4. **Gerar o Build do Frontend**:
   ```bash
   npm run build
   ```
5. **Iniciar o Servidor**:
   ```bash
   npm start
   ```

## Estrutura de Arquivos Importante

- `server.ts`: O servidor backend (Express + WebSocket).
- `dist/`: Pasta gerada após o `npm run build` contendo o frontend otimizado.
- `pesquisas.db`: Arquivo do banco de Dados SQLite (criado automaticamente na primeira execução).

## Notas de Segurança

- Certifique-se de que a porta configurada (padrão 3000) esteja aberta no firewall do servidor.
- Para manter o servidor rodando em segundo plano, recomenda-se o uso de um gerenciador de processos como o **PM2**:
  ```bash
  npm install -g pm2
  pm2 start server.ts --name "vax-saude-publica" --interpreter tsx
  ```
