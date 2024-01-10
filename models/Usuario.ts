import mongoose, { Model } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUsuario {
    nombre: string;
    password: string;
    email:string;
    token: string;
    confirmado: boolean;
}

interface IUsuarioMethos {
    compararPassword(passwordFormulario:string): boolean;
}

type UsuarioModel = Model<IUsuario,IUsuarioMethos>

const usuarioSchema = new mongoose.Schema<IUsuario,UsuarioModel,IUsuarioMethos>({
    nombre:{
        type: String,
        required: true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique: true,
    },
    token:{
        type: String,
    },
    confirmado :{
        type: Boolean,
        default:false,
    },
},{
    timestamps:true
});

// esto es algo que se ejecuta antes de guardar en BD
usuarioSchema.pre("save", async function(next):Promise<void>{
    // esto es para evitar que se vuelva a hashear el password del hash.
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// con este metodo se puede comprobar el password con las mismas funcion de bcrypt
// usuarioSchema.methods.compararPassword = async function(passwordFormulario:string){
//     return await bcrypt.compare(passwordFormulario, this.password);
// }

usuarioSchema.method('compararPassword',async function compararPassword(passwordFormulario:string){
    return await bcrypt.compare(passwordFormulario, this.password);
})

const Usuario  = mongoose.model('Usuario',usuarioSchema);

export default Usuario;