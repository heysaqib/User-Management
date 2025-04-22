const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const {
  isValidName,
  isValidPassword,
  isValidEmail,
  isValidconfirmpassword,
} = require("../validation/regexValidation");

const loginGet = (req, res) => {
  if (req.session.isAdmin) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("adminLogin");
  }
};

const loginPost = async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      if (!user) {
        return res.render("adminLogin", { error: "Invalid email or password" });
      }

      if (!user.isAdmin) {
        return res.render("adminLogin", { error: "You are not an admin" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.render("adminLogin", { error: "Invalid email or password" });
      }

      // Set the admin session
      req.session.isAdmin = true;
      req.session.admin = user; // Store the entire admin user object in the session
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.render("adminLogin", { error: "Something went wrong" });
  }
};

const dashboardGet = async (req, res) => {
  try {
    if (req.session.isAdmin) {
      // Fetch list of non-admin users from the database-5000

      const users = await userModel.find({ isAdmin: false });

      // Get the admin user from the session  
      const admin = req.session.adminUser;

      // Render the adminDashboard.ejs view with the users data and admin data
      res.render("adminDashboard", { users: users, admin: admin.username });
    } else {
      res.redirect("/admin/login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logoutGet = (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
};

// Get all users

const getAllUsers = async (req, res) => {
  try {
    if (req.session.isAdmin) {
      const users = await userModel.find({ isAdmin: false });
      const admin = req.session.admin;
      res.render("adminDashboard", { users, admin: admin.username });
    } else {
      res.redirect("/admin/login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const postUsers = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

const putUsers = async (req, res) => {
  try {
    if (req.session.isAdmin) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      res.send(user);
    } else {
      res.redirect("/admin/login");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUsers = async (req, res) => {
  try {
    if (req.session.isAdmin) {
      const userId = req.params.id;
      const deletedUser = await userModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get the user data for editing
const getEditUser = async (req, res) => {
  try {
    if (req.session.isAdmin) {
      const userId = req.params.id;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      res.render("editUser", { user });
    } else {
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update the user data
const updateUser = async (req, res) => {
  try {
    if (req.session.isAdmin) {
      const userId = req.params.id;
      const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).send({ error: "User not found" });
      }
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("admin/login");
};

const getcreateUser = (req, res) => {
  if (req.session.isAdmin) {
    res.render("createUser");
  } else {
    res.redirect("/admin/dashboard");
  }
};

const postcreateUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation checks
    if (!isValidName(username)) {
      return res
        .status(400)
        .render("createUser", { error: "Invalid username" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).render("createUser", { error: "Invalid email" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .render("createUser", { error: "Invalid password" });
    }
    if (!isValidconfirmpassword(confirmPassword)) {
      return res
        .status(400)
        .render("createUser", { error: "Invalid confirmPassword" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .render("createUser", { error: "Passwords do not match" });
    }

    // Check if email already exists
    const existingUseremail = await userModel.findOne({ email });
    if (existingUseremail) {
      return res
        .status(409)
        .render("createUser", { error: "Email already exists" });
    }

    // Check if username already exists
    const existingUserusername = await userModel.findOne({ username });
    if (existingUserusername) {
      return res
        .status(409)
        .render("createUser", { error: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    // Save the new user
    await newUser.save();

    // Redirect to the admin dashboard or render a success view
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  loginGet,
  loginPost,
  dashboardGet,
  logoutGet,
  getAllUsers,
  postUsers,
  putUsers,
  deleteUsers,
  getEditUser,
  updateUser,
  logout,
  getcreateUser,
  postcreateUser,
};
