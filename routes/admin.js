const express = require("express")
const router = express.Router();



router.get("/login", (req,res)=>{
    res.send("Hi from Admin login")
})

module.exports = router