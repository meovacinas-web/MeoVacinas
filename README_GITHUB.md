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

## Solução para o Site em Branco
Se o site aparecer em branco no GitHub Pages, verifique:
1. **Base Path:** O arquivo `vite.config.ts` **DEVE** estar presente no seu repositório. Eu configurei o `base: '/MeoVacinas/'` para que os links de arquivos (JS/CSS) funcionem corretamente na URL do seu projeto.
2. **Restaurar vite.config.ts:** Se você deletou este arquivo no GitHub, você **DEVE** restaurá-lo. Sem ele, o Vite não sabe como gerar os caminhos corretos.
3. **Branch de Deploy:** Certifique-se de que o GitHub Pages está configurado para servir o branch `gh-pages` (se usou o script `npm run deploy`) ou a pasta `dist` no branch principal.
4. **Case Sensitivity:** O nome da pasta no GitHub (`MeoVacinas`) deve ser idêntico ao configurado no `base` do `vite.config.ts`.
5. **Firebase Authorized Domains:** Certifique-se de que o domínio do GitHub Pages (`meovacinas-web.github.io`) esteja autorizado no console do Firebase (Authentication > Settings > Authorized domains).
6. **Configuração do GitHub Pages:** No seu repositório no GitHub, vá em **Settings > Pages** e verifique se o "Source" está configurado para o branch `gh-pages` (se usou o script de deploy) ou para a pasta `/docs` ou branch principal se fez o upload manual.

4. **Case Sensitivity:** O nome da pasta no GitHub (`MeoVacinas`) deve ser idêntico ao configurado no `base` do `vite.config.ts`.
5. **Firebase Authorized Domains:** Certifique-se de que o domínio do GitHub Pages (`meovacinas-web.github.io`) esteja autorizado no console do Firebase (Authentication > Settings > Authorized domains).
6. **Configuração do GitHub Pages:** No seu repositório no GitHub, vá em **Settings > Pages** e verifique se o "Source" está configurado para o branch `gh-pages` (se usou o script de deploy) ou para a pasta `/docs` ou branch principal se fez o upload manual.
