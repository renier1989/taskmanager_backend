import nodemailer from "nodemailer";

interface IDatos {
  email: string;
  nombre: string;
  token: string;
}

export const emailRegistroUsuario = async (datos: IDatos) => {
  const { email, nombre, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

//   informacion para envio del correo
const info = await transport.sendMail({
    from : '"Task_manager_MERN - Administracion de proyectos - <cuentas@taskmanager.com>"',
    to: email,
    subject: 'TaskManager - Comprueba tu cuenta de Taskmanager',
    text: 'Comprueba tu cuenta de Taskmanager',
    html: `
    <p>Hola, ${nombre}, comprueba tu cuenta de Taskmanager.</p>
    <p>Ya casi podras empezar a administras tu proyecto y colaborar con una gran comididad:</p>
    <p>Ingresa es este link :<a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuentas</a></p>
    <p>Att. Taskmanager team.</p>
    `
})

};

export const emailOlvidePassword = async (datos: IDatos) => {
  const { email, nombre, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

//   informacion para envio del correo
const info = await transport.sendMail({
    from : '"Task_manager_MERN - Administracion de proyectos - <cuentas@taskmanager.com>"',
    to: email,
    subject: 'TaskManager - Reestablece tu password',
    text: 'TaskManager - Reestablece tu password',
    html: `
    <p>Hola, ${nombre}, solicitaste reestablecer tu password.</p>
    <p>Accede al siguiente enlace para reestablecer tu nuevo password:</p>
    <p>Ingresa es este link :<a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>
    <p>Att. Taskmanager team.</p>
    `
})

};
