// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken"
// import Usuario from "../models/Usuario";

// interface ExpressReqRes {
//     (req: Request | any, res: Response,next:NextFunction): void;
//   }

// const checkAuth:ExpressReqRes = async (req,res,next)=>{
//     let token;
//     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
//         try {
//         const envJWT = process.env.JWT_SECRET;
//         token = req.headers.authorization.split(" ")[1];
//         const tokenDecoded:any = jwt.verify(token, (envJWT as string));
//         req.usuario = await Usuario.findById(tokenDecoded.id).select("-password -__v -createdAt -updatedAt -token -confirmado")
//         next();
//         } catch (error) {   
//             return res.status(404).json({ msg: `Hubo un error.!!!`, error});
//         }   
//     }

//     if(!token){
//         const error = new Error(`Token no valido.!!!`);
//         res.status(401).json({ msg: error.message });
//     }
    


// }

// export default checkAuth

import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import Usuario, { IUsuario } from "../models/Usuario";

interface DecodedToken {
    id: string;
    // Agrega aquí cualquier otra propiedad que se espere del token decodificado
}

declare global {
    namespace Express {
        interface Request {
            usuario: IUsuario; // Asegúrate de que IUser coincida con la interfaz de tu modelo de Usuario
        }
    }
}

const checkAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            const envJWT = process.env.JWT_SECRET as Secret;
            token = req.headers.authorization.split(" ")[1];

            const tokenDecoded = jwt.verify(token, envJWT) as DecodedToken;

            try {
                // cuando se le pone a la consulta un "-" antes del campo , se esta indicando que no quiero esos campos,lo omito
                req.usuario = await Usuario.findById(tokenDecoded.id).select("-password -__v -createdAt -updatedAt -token -confirmado");
                return next();
            } catch (error) {
                return res.status(404).json({ msg: `Hubo un error.`, error });
            }
        } catch (error) {
            return res.status(401).json({ msg: "Token inválido" });
        }
    } else {
        return res.status(401).json({ msg: "Token no provisto" });
    }
};

export default checkAuth;

