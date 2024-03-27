import 'dotenv/config'
import connectDB from "./db/db.js";



connectDB();

















/*
import express from "express";

const app = express();
( async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`)
        app.on("eroor",(error)=>{
            console.log("Error in app: ",error);
            throw error
        })

        app.listen(process.env.PORT , () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("error: ",error);
        throw error
    }
})()
*/