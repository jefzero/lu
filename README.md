# Landing Page | Dra. Lu Buttros

Landing page estática desenvolvida para apresentar a oncologista clínica Dra. Lu Buttros, destacando diferenciais, serviços, depoimentos e formas de contato.

## 🌿 Destaques do projeto

- Layout autoral com paleta em tons de verde, dourado e marfim.
- Tipografia combinando `Noto Serif` e `Work Sans` via Google Fonts.
- Componentes animados com Intersection Observer e transições suaves.
- Conteúdo semântico com foco em acessibilidade (skip link, landmarks, aria-labels, foco visível).
- Metadados de SEO, Open Graph/Twitter e JSON-LD para rich snippets.

## 📁 Estrutura

```
.
├── assets/          # Ilustrações SVG otimizadas, favicon e imagem social
├── css/
│   └── styles.css   # Estilos globais
├── js/
│   └── main.js      # Animações e carrossel de depoimentos
├── index.html       # Página principal
└── README.md        # Este arquivo
```

## 🚀 Como visualizar

### Opção rápida (abrir direto)
1. Baixe/clique duas vezes em `index.html` e abra no navegador.
2. Verifique se os arquivos em `css/`, `js/` e `assets/` estão na mesma pasta.

### Servidor local (recomendado para testes)
Use qualquer servidor estático. Exemplos:

```bash
# Node.js
npx serve .

# Python 3
python3 -m http.server 8000
```

Acesse `http://localhost:8000` (ou a porta informada).

## ✅ Checklist de qualidade

- [x] HTML semântico com landmarks (`header`, `main`, `footer`).
- [x] Navegação acessível + smooth scroll compensando o header fixo.
- [x] Imagens locais otimizadas (SVG) com `alt` descritivos e `loading="lazy"`.
- [x] Conteúdo responsivo de 320px a 1200px.
- [x] SEO básico configurado (title, description, OG/Twitter, canonical, JSON-LD).

## 🔜 Próximos passos sugeridos

- Integrar formulário de contato (API / serviço de automação) com validação de dados.
- Substituir placeholders de CRM, telefone e horários por informações oficiais.
- Medir performance/acessibilidade com Lighthouse e ajustar possíveis pontos.
- Configurar automação de deploy (Netlify, Vercel, Cloudflare Pages, etc.).
