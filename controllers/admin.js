const { validationResult } = require("express-validator");

const Product = require("../models/product");

exports.getAllProductsPage = (req, res, next) => {
  Product.find({ userId: req.user._id }) // find method is from mongoose it fetches all the product
    .then(products => {
      res.render("admin/product-list", {
        products,
        pageTitle: "Admin Products",
        path: "admin/products"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddProductPage = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html')); // normal html file
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "admin/edit-product",
    editMode: false,
    hasError: false,
    error: null
  });
};

exports.postProducts = (req, res, next) => {
  console.log(1);
  title = req.body.name;
  imageurl = req.file;
  price = req.body.price;
  description = req.body.description;
  if (!imageurl) {
    console.log(2);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product",
      path: "admin/edit-product",
      editMode: false,
      hasError: true,
      error: "png/jpg/jpeg are supported",
      product: {
        title: title,
        price: price,
        description: description
      }
    });
  }
  console.log(1000, imageurl, imageurl.path);
  // userId = req.user._id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(1212, title, imageurl);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product",
      path: "admin/edit-product",
      editMode: false,
      hasError: true,
      error: error.errors[0].msg,
      product: {
        title: title,
        imageurl: imageurl,
        price: price,
        description: description
      }
    });
  }
  const actualImageUrl = imageurl.path;

  const product = new Product({
    title: title,
    imageurl: actualImageUrl,
    price: price,
    description: description,
    userId: req.user
  });
  product
    .save() // save is method of mongoose package(not in the model)
    .then(response => {
      console.log("created Product");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(121212121);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.prodId;
  Product.findById(prodId).then(product => {
    if (!product) {
      res.send("Product doesn't exist");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "admin/edit-product",
      editMode,
      error: null,
      hasError: false,
      product
    });
  });
};

exports.editProduct = (req, res, next) => {
  const updatedProduct = {
    id: req.body.id,
    title: req.body.name,
    imageurl: req.file,
    price: req.body.price,
    description: req.body.description
  };

  if (!updatedProduct.imageurl) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product",
      path: "admin/edit-product",
      editMode: false,
      hasError: true,
      error: "png/jpg/jpeg are supported",
      product: {
        title: title,
        price: price,
        description: description
      }
    });
  }

  const actualImageUrl = imageurl.path;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(342423, title, imageurl);
    return res.status(422).render("admin/edit-product", {
      path: "admin/edit-product",
      pageTitle: "Edit product",
      error: error.errors[0].msg,
      hasError: true,
      editMode: true,
      product: {
        title: updatedProduct.title,
        imageurl: actualImageUrl,
        price: updatedProduct.price,
        description: updatedProduct.description
      }
    });
  }
  Product.findById(updatedProduct.id)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedProduct.title;
      product.imageurl = updatedProduct.imageurl;
      product.price = updatedProduct.price;
      product.description = updatedProduct.description;
      return product.save().then(response => {
        console.log(response);
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodDetail = req.body.id;
  const prodId = prodDetail.toString().split(",")[0];
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
