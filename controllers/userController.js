const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const { isValidName, isValidPassword, isValidEmail,isValidconfirmpassword } = require('../validation/regexValidation');


const UserloginPost = async (req, res) => {
  try {
      const check = await UserModel.findOne({ email: req.body.email });
      if (!check) {
          return res.render("login", { error: "Invalid user" });
      }
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
          req.session.isAuth = true;
          req.session.useruser = check.email;  
          return res.redirect("/home");
      } else {
          return res.render("login", { error: "Wrong password" });
      }
  } catch (error) {
      console.error("Error logging in user:", error);
      return res.render("login", { error: "Something went wrong" });
  }
}

const UsersignupPost = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        // Validate input fields using regex patterns
        if (!isValidName(username)) {
            return res.status(400).render("signup", { error: "Invalid username" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).render("signup", { error: 'Invalid email' });
        }

        if (!isValidPassword(password)) {
            return res.status(400).render("signup", { error: 'Invalid password' });
        }

        if (!isValidconfirmpassword(confirmPassword)) {
            return res.status(400).render("signup", { error: 'Invalid confirm password' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).render("signup", { error: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ name: username });
        if (existingUser) {
            return res.render("signup", { error: "User already exists. Please choose a different username." });
        }

        // Check if email already exists
        const existingEmail = await UserModel.findOne({ email: email });
        if (existingEmail) {
            return res.render("signup", { error: "Email already exists. Please choose a different email." });
        }

        // If input is valid and user does not already exist, proceed with signup
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = {
            username: username,
            password: hashedPassword,
            email: email
        };
        await UserModel.create(newUser);
        return res.render("login", { success: "User signed up successfully!" });
    } catch (error) {
        console.error("Error signing up user:", error);
        return res.status(500).send("Internal server error");
    }
}

const homeGet = async (req, res) => {
  try {
      if (req.session.isAuth) {
          const user = await UserModel.findOne({ email: req.session.useruser });
          if (!user) {
              return res.render("login");
          }
          res.render("home", { user: user.username });
      } else {
          res.render("login");
      }
  } catch (error) {
      console.error("Error rendering home page:", error);
      res.status(500).send("Internal server error");
  }
}


const logoutGet =   (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  }

const signupGet = (req, res) => {
    res.render("signup");
  }

const loginGet =  (req, res) => {
    res.render("login", { user: req.user });
  } 

module.exports={logoutGet,homeGet,UsersignupPost,UserloginPost,signupGet,loginGet}