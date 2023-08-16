const mongoose=require("mongoose")
const connectionDb=async()=>{
    mongoose.connect(process.env.DBURL).then(()=>{
        console.log("db connected")
    }).catch((e)=>{
        console.log(e)
    })
}

module.exports=connectionDb