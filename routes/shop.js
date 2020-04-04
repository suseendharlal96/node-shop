const express = require("express");
const router = express.Router();
const path = require("path");

const rootDir = require("../util/path");
const adminData = require("./admin");

const isAuth = require("../middleware/is-auth");
const shopController = require("../controllers/shop");

router.get("/", shopController.viewIndexPage);
router.get("/products", shopController.viewProductsPage);
router.get("/cart", isAuth, shopController.viewCartPage);
router.post("/to-cart", isAuth, shopController.postCart);
router.post("/cart/delete-product", isAuth, shopController.deleteCartProduct);
router.get("/product/:proId", shopController.getDetailsPage);
// router.get("/orders", shopController.viewOrdersPage);
// router.post("/order/order-product", shopController.orderProduct);
// router.get("/checkout", shopController.viewCheckoutPage);

module.exports = router;
