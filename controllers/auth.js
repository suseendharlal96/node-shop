const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    error: "",
    validation: [],
    oldData: {
      email: "",
      password: ""
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    error: "",
    validation: [],
    oldData: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const error = validationResult(req);
  console.log(12, error);
  if (!error.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login",
      error: error.errors[0].msg,
      validation: error.errors,
      oldData: {
        email: email,
        password: password
      }
    });
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // req.flash("error", "Invalid credentials");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "login",
          error: "Invalid credentials",
          oldData: {
            email: email,
            password: password
          }
        });
        // return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then(isPsdwrdCorrect => {
          if (isPsdwrdCorrect) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              res.redirect("/");
              console.log(err);
            });
          }
          // req.flash("error", "Invalid credentials");
          // res.redirect("/login");
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "login",
            error: "Invalid credentials",
            oldData: {
              email: email,
              password: password
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(1212, error);
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      error: error.errors[0].msg,
      validation: error.errors,
      oldData: {
        email,
        password,
        confirmPassword: req.body.confirmPassword
      }
    });
  }
  bcrypt
    .hash(password, 12)
    .then(hashPassword => {
      const newUser = new User({
        email: email,
        password: hashPassword,
        cart: { items: [] }
      });
      return newUser.save();
    })
    .then(result => {
      console.log(result);
      transporter
        .sendMail({
          to: email,
          from: "suseendhar-shop",
          subject: "Signup",
          html: "<h1>Signup</h1>"
        })
        .then(result => {
          res.redirect("/login");
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error", "enter valid email");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password"
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No user found with that email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.expiryDate = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "suseendhar-shop",
          subject: "Reset Password",
          html: `<p>Click this <a href="http://localhost:1616/reset/${token}">link</a>
          to reset password</p>`
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  console.log(typeof token, token);
  User.findOne({ resetToken: token, expiryDate: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error", "enter valid email");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      if (user) {
        res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "Update Password",
          error: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      } else {
        return res.redirect("/reset");
      }
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  const password = req.body.password;
  let resetUser;
  User.findOne({
    _id: userId,
    resetToken: token,
    expiryDate: { $gt: Date.now() }
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then(hashPassword => {
      console.log("inside null");
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.expiryDate = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
