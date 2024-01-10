import express from 'express';
import { registrarUsuario, autenticar, confirmar, recuperarPassword, comprobarToken, nuevoPassword, perfil } from '../controllers/usuarioController';
import checkAuth from '../middleware/checkAuth';
// import { crearUsuario, usuario } from '../controllers/usuarioController';
const router = express.Router();

// // ejemplos de funciones definidas en el controlador
// router.get('/', usuario);
// router.post('/', crearUsuario);


// AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS
router.post('/', registrarUsuario)
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', recuperarPassword)


// router.get('/recuperar-password/:token', comprobarToken)
// router.post('/recuperar-password/:token', comprobarToken)
// cuando la ruta es la misma pero con diferentes metodo se puede agrupar de esta forma
router.route('/recuperar-password/:token').get(comprobarToken).post(nuevoPassword);

// esta ruta primero pasa por el middleware para verificar algunas informacion del usuario para permitirle ver su informacion
router.get('/perfil',checkAuth, perfil);

export default router