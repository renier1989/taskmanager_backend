import mongoose, { Model, Types } from "mongoose";
import { IProyecto } from "./Proyecto";
export interface ITarea {
  _id: Types.ObjectId;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaEntrega: Date;
  prioridad: string;
  proyecto: IProyecto;
  completado: Types.ObjectId;
}

type TareaModel = Model<ITarea>;

const tareaSchema = new mongoose.Schema<ITarea, TareaModel>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    fechaEntrega: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
    },
    completado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
