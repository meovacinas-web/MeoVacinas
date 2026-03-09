# MeoVacinas - Deploy to GitHub Pages

Este projeto está pronto para ser hospedado no GitHub Pages.

## Estrutura de Pastas para o GitHub
A estrutura solicitada é gerada automaticamente na pasta `dist` após o build:

```
MeoVacinas
 ├ dist
 │ ├ index.html
 │ ├ assets
```

## Como Fazer o Deploy

### Opção 1: Usando o script de deploy (Recomendado)
Eu instalei o pacote `gh-pages` e adicionei scripts ao `package.json`.
1. No terminal, execute:
   ```bash
   npm run deploy
   ```
   Isso irá gerar o build e enviar automaticamente para o branch `gh-pages` do seu repositório.

### Opção 2: Manualmente via GitHub Actions
Se você preferir usar GitHub Actions, o repositório deve estar configurado para fazer o build e publicar a pasta `dist`.

### Opção 3: Upload Manual
1. Execute `npm run build`.
2. Copie o conteúdo da pasta `dist` para o seu repositório no GitHub (ou para a pasta configurada no GitHub Pages).

## Configurações Importantes
- **Firebase:** O site é totalmente client-side e utiliza o Firebase para autenticação e banco de dados. Certifique-se de que o domínio do GitHub Pages (`seu-usuario.github.io`) esteja autorizado no console do Firebase (Authentication > Settings > Authorized domains).
- **Base Path:** O projeto está configurado com `base: './'` no `vite.config.ts`, o que permite que ele funcione em subpastas ou domínios personalizados sem problemas.
