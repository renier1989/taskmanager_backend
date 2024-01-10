// esto tiene que estar definido antes que todo para que las variables de entorno puedan funcionar
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import conectarDB from "./config/db";
import usuarioRoutes from "./routes/usuarioRoutes";
import proyectoRoutes from "./routes/proyectoRoutes";
import tareaRoutes from "./routes/tareaRoutes";
import cors, { CorsOptionsDelegate } from "cors";

const app = express();
app.use(express.json());
conectarDB();

const whitelist = [process.env.FRONTEND_URL];

const corsOptions: any = {
  origin: function (origin: string, callback: Function) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error con el cors"));
    }
  },
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000;

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

// app.get('/', (req,res)=>{
//     res.json({'hola': 'renier'})
//     // res.send('hola como estas ?');
// })

const servidor = app.listen(PORT, () => {
  console.log(`servidor en el puerto ${PORT}`);
});

// SOCKET.IO
import { Server } from "socket.io";
const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
});

io.on('connection', (socket)=>{
    console.log("Conectado con el servidor de socket.io");

    socket.on('abrir-proyecto',(proyecto_id)=>{
        console.log('Se abrio el proyecto:',proyecto_id);
        // el join crear como una sala, es como un identificador para notificar solo a las personas que tengas ese id de sala
        socket.join(proyecto_id)
        // socket.to(proyecto_id).emit('respuesta', { nombre: 'Hola como va tu dia?' })
    })

    // escucho cuando ocurra el evento de crear nueva tarea
    socket.on('nueva-tarea',(tarea)=>{
        const proyecto = tarea.proyecto;
        // emito el evento solo a los usuarios que esten en el canal
        socket.to(proyecto).emit('tarea-agregada',tarea);
    })

    socket.on('eliminar-tarea', (tarea)=>{
        const proyecto = tarea.proyecto;
        // emito el evento solo a los usuarios que esten en el canal
        socket.to(proyecto).emit('tarea-eliminada',tarea);
    })
    
    socket.on('editar-tarea', (tarea)=>{
        const proyecto = tarea.proyecto._id;
        // emito el evento solo a los usuarios que esten en el canal
        socket.to(proyecto).emit('tarea-editada',tarea);
    })

    socket.on('completar-tarea', (tarea)=>{
        const proyecto = tarea.proyecto._id;
        // emito el evento solo a los usuarios que esten en el canal
        socket.to(proyecto).emit('tarea-completada',tarea);
    })

    

    // aqui es donde se definen los eventos de socket.io
    // socket.on('prueba',(nombre)=>{
    //     console.log('SE EJECUTO LA PRUBA DESDE EL FORNT', nombre);
    //     socket.emit('respuesta', 'Desde el Back hacia el Front');
    // })

})
