const express=require("express")
const app=express()
const connection =require("./configs/connection")
require("dotenv").config()
const authroute=require("./routes/auth")
const userroute=require('./routes/users')
const cookieParser = require('cookie-parser'); 

connection()
app.use(express.json())
app.use(cookieParser());

app.use("/miniproject",authroute)
app.use("/miniproject",userroute)

app.listen(process.env.PORT,()=>{
    console.log("server is running")
})




