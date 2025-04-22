const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const  userController  = require("../controllers/userController");


// Login

router.get("/", isAuthenticated.isAuthenticated, userController.loginGet );

router.get("/login", isAuthenticated.isAuthenticated, userController.loginGet);

router.post("/login", userController.UserloginPost );


// Signup

router.get("/signup", isAuthenticated.isAuthenticated, userController.signupGet );

router.post("/signup", userController.UsersignupPost );


//home

router.get("/home", userController.homeGet );


//logout

router.get("/logout",userController.logoutGet );


module.exports = router;