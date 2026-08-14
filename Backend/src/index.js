import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import DBConn from "./DBConn/dbConn.js";
import router from "./router/router.js"
const app=express();
app.use(cors());
app.use(express.json());
DBConn();

app.use("/api",router)
const Port=process.env.PORT || 5000;
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})