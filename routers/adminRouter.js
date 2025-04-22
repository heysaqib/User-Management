const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const adminController = require("../controllers/adminController")




// Admin Login
router.get("/login", adminController.loginGet);

router.post("/login", adminController.loginPost);


// Admin Dashboard
router.get("/dashboard",adminController.getAllUsers );


//logout
router.get("/admin/logout",adminController.logoutGet );


// Get all users
router.get('/users', adminController.getAllUsers);


// Create a new user
router.post('/users',adminController.postUsers );


// Update an existing user
router.put('/users/:id', adminController.putUsers);


// Delete a user
router.delete('/users/:id', adminController.deleteUsers);

// Edit a user
router.get('/users/:id/edit', adminController.getEditUser);
router.post('/users/:id/edit', adminController.updateUser);

//logout
router.get('/admin/logout',adminController.logout);

//create-user
router.get('/createUser',adminController.getcreateUser)

router.post('/createUser',adminController.postcreateUser)



module.exports = router;