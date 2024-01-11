# TaskManager
Practica Fulltack desarrollada con :  RactJs + Express + MongoDB + Typescript + Socket.io y más..


# Descripción

Este es un proyecto Fullstack, la versión del Backend el cual es desarrollado con Node.js, Express, Typescript, MongoDb y Socket.io. Aquí se almacena los usuarios, los proyectos y las tareas con funcionalidades relacionales entre usuarios y colaboradores y proyectos con sus respectivas tareas.

### Características:

- Configuración con MongoDb y Moongose
- Autenticación con JWT
- Recuperar Contraseña
- Envio de Correos con NodeMailer
- Procesos en tiempo real con Socket.io



# Demo 

Puedes darle un vistazo al proyecto Frontend en ejecución [aqui](https://taskmanager-frontend-renier1989.vercel.app/)

#### Notas: 
El proyecto cuenta con envío de correos para algunas proceso de registro, confirmación y recuperación de contraseña, estos proceso de envío de correo los desarrollo con [Nodemailer](https://nodemailer.com/) usando [MailTrap.io](https://mailtrap.io/) para hacer las pruebas respectivas en el entorno local.

Si deseas probar las funcionalidades de la aplicación puedes ingresar con estos usuarios de prueba:

```bash
  USUARIOS DE PRUEBA:
  Email :     user1@test.com    |    Email :     user2@test.com
  Password :  user1@test.com    |    Password :  user2@test.com
```



# Tecnologías

**Frontend:** React, Typscript, TailwindCSS, Context Api, Socket.io(client), React-rouet-dom, Axios, HeadlessUi, Vite.

**Backend:** NodeJs, Express, MongoDB, Typescript, Socket.io, JWT.


# ⚙ Instalación

Necesitas Node.js (^18)

Clona el repositorio con (https):
```
git clone https://github.com/renier1989/taskmanager_backend.git 
```
Cambia el nombre al archivo .env-example a .env y asegurate de contar con las variables de entorno: 
```
MONGO_URI='mongodb+srv://<USER>:<PASSWORD>@<HOST>/<DBNAME>?retryWrites=true&w=majority'
JWT_SECRET='<string cualquier cadena de texto>'
MAILTRAP_USER=
MAILTRAP_PASS=
MAILTRAP_HOST=
MAILTRAP_PORT=
FRONTEND_URL=http://localhost:5173
```
move to the project folder and Run:
```bash
  cd taskmanager_backend
  npm install or npm i
  npm run dev
```
    
# Instalación del Frontend

para la instalación del Frontend puedes ingresar al siguiente repositorio y seguir los pasos de instalación:

[https://github.com/renier1989/taskmanager_frontend.git](https://github.com/renier1989/taskmanager_frontend.git)






# 💻 About Me
Soy Fullstack Developer,
Puedes conocerme ingresando a mi pagina web personal [🔗](http://reniervargas.com/)