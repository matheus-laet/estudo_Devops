# ─────────────────────────────────────────────────────────────
# DataPulse Dashboard — Dockerfile
# Imagem leve: nginx:alpine (~25 MB)
# ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos do site
COPY html/ /usr/share/nginx/html/

# Porta exposta
EXPOSE 80

# Nginx em foreground (obrigatório para Docker)
CMD ["nginx", "-g", "daemon off;"]
