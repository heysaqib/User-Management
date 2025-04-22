const isAuthenticated = (req, res, next) => {
    if (req.session.isAuth) {
      return res.redirect("/home"); 
    } else {
      next();
    }
  };

  module.exports ={isAuthenticated}