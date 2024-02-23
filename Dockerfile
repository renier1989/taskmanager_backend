FROM node:20.11.0-alpine3.19
# internamente esta imagen posee un directorio = /app y otros directorios

# esto es similar a hacer un cd /app
WORKDIR /app

# copio los archivos necesario para ser usados en el servidor 
COPY index.ts package.json ./

# instalar las dependencias
RUN npm install 

# copio todas los demas archivos en la imagen
COPY . .

# ejecucuio de un comando 
CMD ["npm","run", "dev"]
