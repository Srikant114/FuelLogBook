import mongoose from "mongoose";

const APP_NAME = 'FuelLogBook API'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected',()=>
        console.log(`[${APP_NAME}] Database Connected`)
        ) 
        
        await mongoose.connect(process.env.MONGO_DB_URI)
    } catch (error) {
         console.log(`[${APP_NAME}] Database Connection Error ❌`, error.message);
    }
}

export default connectDB
