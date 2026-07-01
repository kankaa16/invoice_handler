import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();

connectDB();


const app=express()

app.use(cors());


app.use(express.json());


app.get("/",(req,res)=>{
    res.send("server running...");
});

app.use("/api/upload", uploadRoutes);

app.use("/api/invoices", invoiceRoutes);

app.listen(5010,()=>{
    console.log("server running on http://localhost:5010");
});