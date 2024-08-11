# Etapa 1: Construção da imagem
FROM node:18-alpine AS build

# Definindo o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiando arquivos package.json e package-lock.json
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando todos os arquivos do projeto para o contêiner
COPY . .

# Compilando o projeto
RUN npm run build

# Etapa 2: Servindo a aplicação
FROM nginx:alpine

# Copiando a build da primeira etapa para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiando o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expondo a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]