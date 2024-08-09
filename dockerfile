# Utiliza a imagem oficial do PostgreSQL
FROM postgres:latest

# Defina variáveis de ambiente
ENV POSTGRES_USER postgres_user
ENV POSTGRES_PASSWORD postgres_password
ENV POSTGRES_DB postgres_db

# Copia o arquivo de inicialização SQL para criar o banco de dados
COPY init.sql /docker-entrypoint-initdb.d/

# Expõe a porta padrão do PostgreSQL
EXPOSE 5432