# DataPulse — Dashboard

Dashboard de monitoramento web com dark mode, servido via **Nginx dentro de Docker**.

---

## Estrutura do projeto

```
datapulse/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .dockerignore
├── .gitignore
└── html/
    ├── index.html
    ├── style.css
    └── main.js
```

---

## Subir com Docker Compose (recomendado)

```bash
# 1. Build e sobe o container
docker compose up -d --build

# 2. Acesse no navegador
http://localhost:8080

# 3. Ver logs
docker compose logs -f

# 4. Parar
docker compose down
```

---

## Subir com Docker puro

```bash
# Build da imagem
docker build -t datapulse:latest .

# Rodar o container
docker run -d \
  --name datapulse-dashboard \
  -p 8080:80 \
  --restart unless-stopped \
  datapulse:latest

# Verificar se subiu
docker ps

# Ver logs
docker logs -f datapulse-dashboard

# Parar e remover
docker stop datapulse-dashboard && docker rm datapulse-dashboard
```

---

## Fluxo Git → Deploy

```bash
# 1. Iniciar repositório (apenas na primeira vez)
git init
git remote add origin https://github.com/seu-usuario/datapulse.git

# 2. Commitar e enviar
git add .
git commit -m "feat: dashboard com aba serviços e Docker"
git push -u origin main

# 3. No servidor — clonar e subir
git clone https://github.com/seu-usuario/datapulse.git
cd datapulse
docker compose up -d --build
```

---

## Mudar a porta

Edite o `docker-compose.yml`:
```yaml
ports:
  - "3000:80"   # troca 8080 pela porta que quiser
```

---

## Atualizar o site após mudança de código

```bash
git pull
docker compose up -d --build
```

---

## Notas

- A imagem base é `nginx:alpine` (~25 MB) — leve e segura.
- Gzip habilitado para CSS e JS.
- Healthcheck configurado: Docker reinicia o container automaticamente se ele travar.
- Para ambiente **sem internet** (intranet), as fontes Google Fonts não carregam. Avise para adaptar para fontes do sistema.
