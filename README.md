# Recanto Do Moura — Site

Site de uma página (one-page) para o **Recanto Do Moura / Bar do Moura**, bar e
restaurante em São Caetano, Salvador. Feito em HTML, CSS e JavaScript puros —
sem frameworks, rápido e fácil de editar.

## Como abrir

Basta abrir o arquivo `index.html` no navegador (clique duas vezes).
Para publicar, é só hospedar a pasta inteira em qualquer serviço de site estático
(Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

```
index.html              → conteúdo e textos do site
assets/css/styles.css   → cores, fontes e layout
assets/js/script.js     → menu mobile, animações e ano do rodapé
```

## O que você provavelmente vai querer trocar

### 1. Fotos (importante!)
As imagens atuais são **placeholders de alta qualidade (Unsplash)** e devem ser
substituídas por **fotos reais do bar, dos pratos e do ambiente**.

- **Foto do fundo do topo (Hero):** em `assets/css/styles.css`, procure por `.hero-bg`.
- **Foto do "Sobre":** procure por `.sobre-image`.
- **Fotos dos pratos:** procure por `.menu-img-1` até `.menu-img-6`.
- **Foto do "Ambiente":** procure por `.ambiente`.

Dica: salve as fotos reais em `assets/img/` e troque o link `url('...')` pelo
caminho do arquivo, por exemplo: `url('../img/mocostela.jpg')`.

### 2. Instagram
No `index.html`, procure por `https://www.instagram.com/` e por `@recantodomoura`
e troque pelo perfil oficial.

### 3. WhatsApp
Já está configurado para **(71) 98826-6611** (`wa.me/5571988266611`).
Se o número mudar, faça "localizar e substituir" por `5571988266611`.

### 4. Horários
Por enquanto a seção orienta o cliente a confirmar pelo WhatsApp/Instagram/Google.
Quando tiver os horários oficiais, edite a seção `#horarios` no `index.html`.

## Recursos já incluídos
- Totalmente responsivo (celular, tablet, notebook e desktop).
- Botão flutuante de WhatsApp em todas as telas.
- Menu compacto (hambúrguer) no celular.
- Mapa do Google incorporado + botão de rota.
- SEO local configurado (title, description, palavras-chave e dados estruturados).
- Animações suaves de entrada ao rolar a página.
```
```
