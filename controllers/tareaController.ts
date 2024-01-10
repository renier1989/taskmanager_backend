import { Request, Response } from "express";
import Tarea from "../models/Tarea";
import Proyecto from "../models/Proyecto";
import { isValidId } from "../helpers/validId";
import { Types } from "mongoose";

interface ExpressReqRes {
  (req: Request | any, res: Response): void;
}

const agregarTarea: ExpressReqRes = async (req, res) => {
  const { proyecto } = req.body;
  const ExisteProyecto = await Proyecto.findById(proyecto);

  if (!ExisteProyecto) {
    const error = new Error(`El proyecto no Existe.!!!`);
    return res.status(404).json({ msg: error.message });
  }

  // compruebo si la persona autenticada es el creador del proyecto para permitirle agregar tareas a ese proyecto
  if (ExisteProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error(`No puedes agregar tareas a este Proyecto.!!!`);
    return res.status(401).json({ msg: error.message });
  }

  try {
    const tareaNueva = await Tarea.create(req.body);
    // aqui registro en el proyecto las tareas relacionadas a ese proyecto
    ExisteProyecto.tareas.push(tareaNueva._id);
    // guardo la actualizacion del proyecto con la nueva tarea
    await ExisteProyecto.save();
    res.status(200).json(tareaNueva);
  } catch (error) {
    console.log(error);
  }
};
const obtenerTarea: ExpressReqRes = async (req, res) => {
  const { id } = req.params;
  try {
    // esto es para que no salte un error si el id no es valido
    if (!isValidId(id)) {
      const error = new Error(`No pudimos encontrar la tarea.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    const tarea = await Tarea.findById(id).populate("proyecto");

    // verifico si puedo ver las tareas de un proyecto que no he creado
    if (tarea?.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error(
        `No puedes vizualizar las tareas a este Proyecto.!!!`
      );
      return res.status(401).json({ msg: error.message });
    }

    res.status(200).json(tarea);
  } catch (error) {
    console.log(error);
  }
};
const actualizarTarea: ExpressReqRes = async (req, res) => {
  const { id } = req.params;
  try {
    // esto es para que no salte un error si el id no es valido
    if (!isValidId(id)) {
      const error = new Error(`No pudimos encontrar la tarea.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    const tarea: any = await Tarea.findById(id).populate("proyecto");

    // verifico si puedo ver las tareas de un proyecto que no he creado
    if (tarea?.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error(`No puedes editar esta Tarea.!!!`);
      return res.status(401).json({ msg: error.message });
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;

    const tareaActualizada = await tarea.save();
    res.status(200).json(tareaActualizada);
  } catch (error) {
    console.log(error);
  }
};
const eliminarTarea: ExpressReqRes = async (req, res) => {
  const { id } = req.params;
  try {
    // esto es para que no salte un error si el id no es valido
    if (!isValidId(id)) {
      const error = new Error(`No pudimos encontrar la tarea.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    const tarea = await Tarea.findById(id).populate("proyecto");

    // verifico si puedo ver las tareas de un proyecto que no he creado
    if (tarea?.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error(`No puedes eliminar esta Tarea.!!!`);
      return res.status(401).json({ msg: error.message });
    }

    // consulto el proyecto para acceder a las tareas
    const proyecto = await Proyecto.findById(tarea?.proyecto);
    // ESTO SE HACE ASI DEBIDO AL TIPADO DE TYPESCRIPT
    // UNA ALTERNATIVA SIN TYPESCRIPT SERIA
    // // proyecto.tareas.pull(tarea._id)
    const idTarea = new Types.ObjectId(tarea?._id);
    if (proyecto) {
      proyecto.tareas = proyecto?.tareas.filter((tareaState) =>
        !tareaState._id.equals(idTarea)
      );
    }

    await Promise.allSettled([
      await proyecto?.save(),
      await tarea?.deleteOne(),
    ]);

    res.status(200).json({ msg: `Tarea eliminada con exito.!!!` });
  } catch (error) {
    console.log(error);
  }
};
const cambiarEstadoTarea: ExpressReqRes = async (req, res) => {
  const { id } = req.params;
  try {
    // esto es para que no salte un error si el id no es valido
    if (!isValidId(id)) {
      const error = new Error(`No pudimos encontrar la tarea.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    const tarea = await Tarea.findById(id).populate("proyecto");

    // verifico si puedo ver las tareas de un proyecto que no he creado
    if (
      tarea?.proyecto.creador.toString() !== req.usuario._id.toString() &&
      !tarea?.proyecto.colaboradores.some(
        (colaborador) =>
          colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error(`No puedes eliminar esta Tarea.!!!`);
      return res.status(401).json({ msg: error.message });
    }

    if (tarea) {
      tarea.estado = !tarea.estado;
      tarea.completado = req.usuario._id;
    }
    await tarea?.save();

    // despues de guardar la tarea con su nuevo estado y registrar quien la competo
    // consulto nuevamente la tarea para enviar la informacion con el populate de la info de quien completo la tarea
    const tareaAlmacenada = await Tarea.findById(id)
      .populate("proyecto")
      .populate("completado");
    console.log(tareaAlmacenada);
    

    res.status(200).json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoTarea,
};
