const http = require("http");
const fs = require("fs"); // File system

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
// const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

// const mongoConnect = require("./util/database").mongoConnect;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");

const User = require("./models/user");
const mongodbUri =
  "mongodb+srv://suseendhar:susee@1965LSSL@suseendhar-v3enu.mongodb.net/shop";

const errorController = require("./controllers/error");
const app = express();
const store = new mongoDbStore({
  uri: mongodbUri,
  collection: "sessions"
});

// const fileStore = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   }
// });
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
app.use(flash());
// Pug Template 1st method
// app.set('view engine', 'pug');
// app.set('views', 'views');

// Handlebars Template 2nd method
// app.engine('hbs', handlebars()); // 1st parameter our wish & 2nd from require
// app.set('view engine', 'hbs'); // 2nd para should match the above 1st
// app.set('views', 'views');

// Ejs Template 3rd method
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false })); // parse the data from the request
// app.use(
//   multer({ storage: fileStore, fileFilter: fileFilter }).single("imageurl")
// ); // imageurl is html input name for image
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store
  })
);
// const csrfProtection = csrf();

// app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.showErrorPage);

// app.use((error, req, res, next) => {
//   console.log("sdfdfdsf");
//   res.status(500).render("error-page", {
//     pageTitle: "Error",
//     path: "error",
//     isAuthenticated: true
//   });
// });
app.use(errorController.pageNotFound);

mongoose
  .connect(mongodbUri, { useNewUrlParser: true })
  .then(result => {
    app.listen(1616);
  })
  .catch(err => console.log(err));
