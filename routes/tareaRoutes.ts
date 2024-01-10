import express from "express";
import {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoTarea,
} from "../controllers/tareaController";
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

router.post("/", checkAuth, agregarTarea);

router
  .route("/:id")
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, actualizarTarea)
  .delete(checkAuth, eliminarTarea);

router.post("/estado/:id", checkAuth, cambiarEstadoTarea);

export default router;
