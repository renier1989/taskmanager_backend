import mongoose, { Model, Types } from "mongoose";

export interface IProyecto{
    _id: Types.ObjectId;
    nombre: string;
    descripcion: string;
    fechaEntrega: Date;
    cliente: string;
    creador: Types.ObjectId;
    colaboradores: Types.ObjectId[];
    tareas: Types.ObjectId[];
}

type ProyectoModel = Model<IProyecto>

const proyectoSchema = new mongoose.Schema<IProyecto,ProyectoModel>({
    nombre:{
        type: String,
        required: true,
        trim: true,
    },
    descripcion:{
        type: String,
        required: true,
        trim: true,
    },
    fechaEntrega:{
        type: Date,
        default: new Date(),
    },
    cliente: {
        type: String,
        required: true,
        trim: true,
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tarea"
        }
    ],
    colaboradores:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }
    ]
},
{
    timestamps : true
})

const Proyecto = mongoose.model('Proyecto',proyectoSchema);
export default Proyecto;