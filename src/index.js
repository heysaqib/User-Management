const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 2000;
const session = require("express-session");
const isAuthenticated = require("../middleware/isAuthenticated");
const nocache = require("nocache");
const userRouter = require("../routers/userRouter"); // Import the user router
const adminRouter = require("../routers/adminRouter")

const app = express();
app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));


app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// User routes
app.use("/", userRouter); 

// Admin routes
app.use("/admin", adminRouter); 


app.listen(PORT, () => {
  console.log(`running....http://localhost:${PORT}`);
});