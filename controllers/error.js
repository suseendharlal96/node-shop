const isAuth = require("../middleware/is-auth");

exports.pageNotFound = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', 'error-page.html')); // normal html file
  res.status(404).render("page-not-found", {
    pageTitle: "Page not found",
    path: "error",
    isAuthenticated: isAuth
  });
};
exports.showErrorPage = (req, res, next) => {
  console.log('errrrrrrrr')
  // res.status(404).sendFile(path.join(__dirname, 'views', 'error-page.html')); // normal html file
  res.status(500).render("error-page", {
    pageTitle: "Error",
    path: "error",
    isAuthenticated: isAuth
  });
};
