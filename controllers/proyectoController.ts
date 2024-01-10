import { Request, Response } from "express";
import Proyecto from "../models/Proyecto";
import mongoose, { Types } from "mongoose";
import { isValidId } from "../helpers/validId";
import Usuario from "../models/Usuario";

interface ExpressReqRes {
  (req: Request | any, res: Response): void;
}

// OBTENGO LOS PROYECTOS DEL USUARIO AUTENTICADO
const obtenerProyectos: ExpressReqRes = async (req, res) => {
  // forma de consultar al modelo de proyectos por los colaboradores o el credor
  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  }).select("-tareas");
  res.status(200).json(proyectos);

  // const proyectos = await Proyecto.find()
  // .where("creador")
  //   .equals(req.usuario)
  //   .select("-tareas");
  // res.status(200).json(proyectos);
};

// CREO NUEVOS PROYECRO PARA EL USUARIO AUTENTICADO
const nuevoProyecto: ExpressReqRes = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoRegistrado = await proyecto.save();
    res.status(200).json(proyectoRegistrado);
  } catch (error) {
    console.log(error);
  }
};

// OBTENER UN PROYECTO POR ID
const obtenerProyecto: ExpressReqRes = async (req, res) => {
  const { id } = req.params;
  try {
    // esto es para que no salte un error si el id no es valido
    if (!isValidId(id)) {
      const error = new Error(`El proyecto que estas buscando no Existe.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    const proyecto = await Proyecto.findById(id)
      .populate({
        path: "tareas",
        populate: { path: "completado", select: "nombre" },
      })
      // .populate("tareas")
      .populate("colaboradores", "nombre email");
    if (!proyecto) {
      const error = new Error(`El proyecto que estas buscando no Existe.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    // validacion para mostrar el proyecto. al usuario
    // si no es el creador y si el usuario no esta en la lista de los colaboradores del proyecto
    // entonces muestro la alerta que no puedo ingresar al proyecto
    if (
      proyecto.creador?.toString() !== req.usuario._id.toString() &&
      !proyecto.colaboradores.some(
        (colaborador) =>
          colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error(`No puedes ingresar a este proyecto.!!!`);
      return res.status(401).json({ msg: error.message });
    }

    // obtengo las tareas del proyecto que estoy consultando
    // const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);

    res.status(200).json({
      proyecto,
      // , tareas
    });
  } catch (error) {
    console.log(error);
  }
};

const editarProyecto: ExpressReqRes = async (req, res) => {
  const { id } = req.params;
  try {
    // esto es para que no salte un error si el id no es valido
    const valid = mongoose.Types.ObjectId.isValid(id);

    if (!valid) {
      const error = new Error(`El proyecto que estas buscando no Existe.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      const error = new Error(`El proyecto que estas buscando no Existe.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador?.toString() !== req.usuario._id.toString()) {
      const error = new Error(`No puedes editar a este proyecto.!!!`);
      return res.status(401).json({ msg: error.message });
    }

    // accedo al modelo de proyecto, si viene algo en el req uso eso datos sino uso los que ya estaban en la BD
    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    const proyectoActualizado = await proyecto.save();
    res.status(200).json(proyectoActualizado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto: ExpressReqRes = async (req, res) => {
  const { id } = req.params;
  try {
    // esto es para que no salte un error si el id no es valido
    const valid = mongoose.Types.ObjectId.isValid(id);

    if (!valid) {
      const error = new Error(`El proyecto que estas buscando no Existe.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      const error = new Error(`El proyecto que estas buscando no Existe.!!!`);
      return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador?.toString() !== req.usuario._id.toString()) {
      const error = new Error(`No puedes eliminar a este proyecto.!!!`);
      return res.status(401).json({ msg: error.message });
    }

    await proyecto.deleteOne();
    res.status(200).json({ msg: `Proyecto eliminado.!!!` });

    // // accedo al modelo de proyecto, si viene algo en el req uso eso datos sino uso los que ya estaban en la BD
    // proyecto.nombre = req.body.nombre || proyecto.nombre;
    // proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    // proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    // proyecto.cliente = req.body.cliente || proyecto.cliente;

    // const proyectoActualizado = await proyecto.save();
  } catch (error) {
    console.log(error);
  }
};

const buscarColaborador: ExpressReqRes = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-token -createdAt -updatedAt -password -__v -confirmado"
  );

  if (!usuario) {
    const error = new Error(`El Usuario no fue encontrado.!!!`);
    return res.status(404).json({ msg: error.message });
  }
  res.json(usuario);
};

const agregarColaborador: ExpressReqRes = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  // valido que el proyecto existe
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado!");
    return res.status(404).json({ msg: error.message });
  }

  // valido solo pueda registrar colaboradores la persona que creo el proyecto
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no Permitida!");
    return res.status(404).json({ msg: error.message });
  }

  // valido que el usuario exista y lo busco por el correo que fue ingresado
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-token -createdAt -updatedAt -password -__v -confirmado"
  );

  if (!usuario) {
    const error = new Error(`El Usuario no fue encontrado.!!!`);
    return res.status(404).json({ msg: error.message });
  }

  // valido que el creador del proyecto no se agregue como colaborador
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error(
      `El creador del poryecto no puede ser colaborador!`
    );
    return res.status(404).json({ msg: error.message });
  }

  // valido que el usuario ya no este registrado en el proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error(`El usuario ya es colaborador de este proyecto!`);
    return res.status(404).json({ msg: error.message });
  }

  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: "Colaborador fue agregado con exito!" });
};

const eliminarColaborador: ExpressReqRes = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  // valido que el proyecto existe
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado!");
    return res.status(404).json({ msg: error.message });
  }

  // valido solo pueda registrar colaboradores la persona que creo el proyecto
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no Permitida!");
    return res.status(404).json({ msg: error.message });
  }

  const idColaborador = new Types.ObjectId(req.body.id);
  proyecto.colaboradores = proyecto.colaboradores.filter(
    (id) => !id.equals(idColaborador)
  );

  await proyecto.save();
  res.json({ msg: "Colaborador fue Eliminado con exito!" });
};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
};
