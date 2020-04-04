const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

router.get("/add", isAuth, adminController.getAddProductPage);
router.get("/products", isAuth, adminController.getAllProductsPage);
router.post(
  "/show",
  isAuth,
  [
    body("name")
      .isLength({ min: 2 })
      .withMessage("Min 2 characters"),
    body("price")
      .isNumeric()
      .withMessage("Enter price"),
    body("description")
      .isLength({ min: 2 })
      .withMessage("Min 2 characters")
  ],
  adminController.postProducts
);
router.get("/edit-product/:prodId", isAuth, adminController.getEditProductPage);
router.post(
  "/edit-product",
  isAuth,
  [
    body("name")
      .isLength({ min: 2 })
      .withMessage("Min 2 characters"),
    body("price")
      .isNumeric()
      .withMessage("Enter price"),
    body("description")
      .isLength({ min: 2 })
      .withMessage("Min 2 characters")
  ],
  adminController.editProduct
);
router.post("/delete-product", isAuth, adminController.deleteProduct);

// module.exports = router; // method 1
module.exports = router;
