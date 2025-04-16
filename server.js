const express = require("express")
const app = express();
const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")



app.use("/user", userRoutes)
app.use("/admin", adminRoutes);








app.listen(5000,()=>{
    console.log("------------------------");
    console.log("Server started at : http://localhost:5000");
    console.log("------------------------");
})