const authroutes=require("express").Router()
const{approutes}=require("../configs/routes")
const {signupFunction,loginUser,logoutUser}=require('../controllers/authController')
const {uploadProfilePicture}=require("../controllers/profilePicture")
const {authenticate} =require("../middlewares/authentication")

authroutes.post(approutes.signup,signupFunction)
authroutes.post(approutes.login,loginUser)
authroutes.post(approutes.logout,authenticate,logoutUser)
authroutes.put(approutes.uploadprofile,authenticate,uploadProfilePicture)

module.exports=authroutes