import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const connection=await mongoose.connect(process.env.MONGO_URI);
        console.log("db connected..");
    }
    catch(err){
        console.log("db connection failed...");
        process.exit(45);
    }
};

export default connectDB;