import mongoose from "mongoose";


const conectarDB = async()=>{
    try {
        const envUri = process.env.MONGO_URI;
        
        const connection = await mongoose.connect(
            (envUri as string),
            // (process.env.MONGO_URI as string),
            // 'mongodb+srv://root:root@cluster0.nam33xf.mongodb.net/taskmanager?retryWrites=true&w=majority'
        // ,{
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // }
        );

        const url = `${connection.connection.host} : ${connection.connection.port}`;
        console.log(`MongoDB conectado a : ${url}`);
        
    
    } catch (error:any) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // es para terminar el proceso de fomra forzada y asincrona
    }
}

export default conectarDB;