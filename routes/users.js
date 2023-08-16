const userroutes=require("express").Router()
const {authenticate} =require("../middlewares/authentication")
const{approutes}=require("../configs/routes")
const {getallUsers,sendfriendRequest,getfriendRequests,acceptfriendRequest,rejectfriendRequest,getfriendList}=require("../controllers/userController")

userroutes.get(approutes.getallusers,authenticate,getallUsers)
userroutes.get(approutes.freinds,authenticate,getfriendList)
userroutes.post(approutes.sendrequest,authenticate,sendfriendRequest)
userroutes.get(approutes.freindrequests,authenticate,getfriendRequests)
userroutes.put(approutes.acceptrequest,authenticate,acceptfriendRequest)
userroutes.put(approutes.rejectrequest,authenticate,rejectfriendRequest)

module.exports=userroutes