# DataPulse — Dashboard

Dashboard web estático com dark mode, pronto para deploy.

## Estrutura do projeto

```
dashboard/
├── index.html        ← página principal
├── css/
│   └── style.css     ← todos os estilos
├── js/
│   └── main.js       ← lógica e interações
└── README.md
```

## Como rodar localmente

Basta abrir o `index.html` no navegador. Por ser estático (HTML + CSS + JS puro), **não precisa de servidor, Node.js ou build**.

Opcionalmente, com o VS Code, use a extensão **Live Server** para hot-reload.

## Deploy

Por ser 100% estático, o projeto pode ser hospedado em:

| Plataforma     | Comando / instrução                          |
|----------------|----------------------------------------------|
| **Nginx**      | Copiar pasta para `/var/www/html/`           |
| **Apache**     | Copiar pasta para `/var/www/html/`           |
| **GitHub Pages** | Ativar Pages apontando para `main / root` |
| **Netlify**    | Drag & drop da pasta ou conectar ao repo     |
| **Vercel**     | `vercel --prod` na raiz do projeto           |
| **S3 + CloudFront** | Upload dos arquivos + configurar index.html |

## Dependências externas (CDN)

- Google Fonts — `Syne` e `DM Mono`  
  → Requer conexão com internet. Para ambiente offline, baixe as fontes e ajuste o `<link>` no `index.html`.

## Funcionalidades

- ✅ Sidebar com navegação ativa
- ✅ Topbar com data dinâmica e busca
- ✅ 4 KPI cards com contador animado
- ✅ Gráfico de linha semanal (SVG animado)
- ✅ Gráfico donut de distribuição
- ✅ 6 cards de status de serviços
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Sidebar colapsável no mobile

## Personalização rápida

Todas as cores estão em variáveis CSS no topo do `style.css`:

```css
:root {
  --bg-base:    #0b0d14;   /* fundo principal */
  --accent-green:  #00f5a0;
  --accent-purple: #7c6fff;
  /* ... */
}
```

Para trocar dados dos KPI cards, edite os atributos `data-target` no `index.html`:

```html
<div class="kpi-card__value" data-target="12847">0</div>
```
