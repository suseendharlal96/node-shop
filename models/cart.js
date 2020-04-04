// // using FILESYSTEM:
// // const fs = require('fs');
// // const path = require('path');

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   'data',
// //   'cart.json'
// // );

// // module.exports = class Cart {
// //   static addProduct(id, productPrice) {
// //     // Fetch the previous cart
// //     fs.readFile(p, (err, fileContent) => {
// //       let cart = { products: [], totalPrice: 0 };
// //       if (!err) {
// //         // will enter here only if the cart.json file exists & already has data
// //         cart = JSON.parse(fileContent);
// //         console.log('cart', cart);
// //       }
// //       // Analyze the cart => Find existing product
// //       const existingProductIndex = cart.products.findIndex(
// //         prod => prod.id === id
// //       );
// //       // if (existingProductIndex === -1) {

// //       // }
// //       const existingProduct = cart.products[existingProductIndex];
// //       console.log('ex', existingProduct);
// //       let updatedProduct;
// //       // Add new product/ increase quantity
// //       if (existingProduct) {
// //         updatedProduct = { ...existingProduct };
// //         updatedProduct.qty = updatedProduct.qty + 1;
// //         cart.products = [...cart.products];
// //         cart.products[existingProductIndex] = updatedProduct;
// //       } else {
// //         updatedProduct = { id: id, qty: 1 };
// //         cart.products = [...cart.products, updatedProduct];
// //       }
// //       cart.totalPrice = cart.totalPrice + +productPrice;
// //       fs.writeFile(p, JSON.stringify(cart), err => {
// //         console.log('writeErr', err);
// //       });
// //     });
// //   }

// //   static deleteProduct(id, price) {
// //     fs.readFile(p, (err, fileContent) => {
// //       if (err) {
// //         return;
// //       }
// //       const updatedCart = { ...JSON.parse(fileContent) };
// //       const product = updatedCart.products.find(prod => prod.id === id);
// //       const productQty = product.qty;
// //       updatedCart.products = updatedCart.products.filter(
// //         prod => prod.id !== id
// //       );
// //       updatedCart.totalPrice = updatedCart.totalPrice - price * productQty;

// //       fs.writeFile(p, JSON.stringify(updatedCart), err => {
// //         console.log(err);
// //       });
// //     });
// //   }

// //   static getCart(cb) {
// //     fs.readFile(p, (err, fileContent) => {
// //       if (err) {
// //         cb(null);
// //       } else {
// //         const cart = JSON.parse(fileContent);
// //         cb(cart);
// //       }
// //     });
// //   }
// // };

// // using sequalizer:

// const Sequalize = require("sequelize");
// const sequalizer = require("../util/database");

// const Cart = sequalizer.define("cart", {
//   id: {
//     type: Sequalize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   }
// });

// module.exports = Cart;
