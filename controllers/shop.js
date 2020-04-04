const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.viewProductsPage = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'shop.html')); // normal html file
  Product.find().then(products => {
    res.render("shop/product-list", {
      products,
      pageTitle: "Products",
      path: "products",
      isAuthenticated: req.session.isLoggedIn
    }); // will search for shop/product-list.ejs file(depending on template engine you use in app.js)
  });
};
exports.viewIndexPage = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        products,
        pageTitle: "Welcome",
        path: "index"
      });
    })
    .catch(err => console.log(err));
};

exports.getDetailsPage = (req, res, next) => {
  const prodId = req.params.proId;
  Product.findById(prodId)
    .then(prodDetail => {
      res.render("shop/product-detail", {
        product: prodDetail,
        pageTitle: "Details",
        path: "products"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.viewCartPage = (req, res, next) => {
  req.user
    .populate("cart.items.productId") //populates with the details of product with the id
    .execPopulate()
    .then(cartItems => {
      console.log("c", cartItems.cart.items);
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "cart",
        cart: cartItems.cart.items
      });
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(12, result);
      res.redirect("/cart");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
//   const prodId = req.body.productId;
//   console.log("dfds", prodId);
//   let newQuantity = 1;
//   let myCart;
//   req.user
//     .getCart()
//     .then(cart => {
//       myCart = cart;
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then(products => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product;
//       }
//       return Product.findByPk(prodId);
//     })
//     .then(prod => {
//       return myCart.addProduct(prod, { through: { quantity: newQuantity } });
//     })
//     .then(result => {
//       res.redirect("/cart");
//     })
//     .catch(err => console.log(err));
//   // Product.getProductDetails(prodId, product => {
//   //   Cart.addProduct(prodId, product.price);
//   // });
//   // res.redirect("/cart");
// };
exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
//   const prodDetail = req.body.productId;
//   const prodId = prodDetail.split(",")[0];
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart.getProducts({ where: { id: +prodId } });
//     })
//     .then(products => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(result => {
//       res.redirect("/cart");
//     })
//     .catch(err => console.log(err));
//   // const prodPrice = prodDetail.split(",")[1];
//   // Cart.deleteProduct(prodId, prodPrice);
//   // res.redirect("/cart");
// };

exports.viewOrdersPage = (req, res, next) => {
  req.user.getOrders().then(orders => {
    console.log("121", orders);
    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "orders",
      orders
    });
  });
};
//   req.user
//     .getOrders({ include: ["products"] })
//     .then(orders => {
//       res.render("shop/orders", {
//         pageTitle: "Your Orders",
//         path: "orders",
//         orders
//       });
//     })
//     .catch(err => console.log(err));
//   // res.render("shop/orders", {
//   //   pageTitle: "Your Orders",
//   //   path: "orders"
//   // });
// };

exports.orderProduct = (req, res, next) => {
  req.user.addOrder().then(result => {
    console.log(result);
    res.redirect("/orders");
  });
};
//   let myCart;
//   req.user
//     .getCart()
//     .then(cart => {
//       myCart = cart;
//       return cart
//         .getProducts()
//         .then(products => {
//           return req.user
//             .createOrder()
//             .then(order => {
//               return order.addProducts(
//                 products.map(product => {
//                   product.orderItem = {
//                     quantity: product.cartItem.quantity
//                   };
//                   return product;
//                 })
//               );
//             })
//             .catch(err => console.log("AAA", err));
//         })
//         .then(res => {
//           return myCart.setProducts(null);
//         })
//         .then(result => {
//           console.log("RES", result);
//           res.redirect("/orders");
//         });
//     })
//     .catch(err => console.log("BBB", err));
// };

// exports.viewCheckoutPage = (req, res, next) => {
//   res.render("shop/checkout", {
//     products,
//     pageTitle: "Checkout",
//     path: "checkout"
//   });
// };
