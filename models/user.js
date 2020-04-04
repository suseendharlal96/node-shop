const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  expiryDate: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const prodIndex = this.cart.items.findIndex(c => {
    return c.productId.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.cart.items];
  let newQuantity = 1;
  if (prodIndex !== -1) {
    newQuantity = this.cart.items[prodIndex].quantity + 1;
    updatedCartItems[prodIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(prodId) {
  const updateCartItems = this.cart.items.filter(
    c => c.productId.toString() !== prodId.toString()
  );
  this.cart.items = updateCartItems;
  return this.save();
};
// userSchema.methods.addOrder = function() {
// return this.cart.items;
// };

module.exports = mongoose.model("User", userSchema);
// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(name, email, id, cart) {
//     this.name = name;
//     this.email = email;
//     this.id = id;
//     this.cart = cart;
//   }

//   saveUser() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => console.log(err));
//   }

//   addToCart(products) {
//   }

//   getCart() {
//     const db = getDb();
//     const prodId = this.cart.items.map(i => {
//       return i.productId;
//     });
//     console.log("23f", prodId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: prodId } })
//       .toArray()
//       .then(products => {
//         console.log("pp", products);
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteCart(productId) {
//     const updatedCart = this.cart.items.filter(c => {
//       return c.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectID(this.id) },
//         { $set: { cart: { items: updatedCart } } }
//       );
//   }

//   static findUserById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectID(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => console.log(err));
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             id: this.id,
//             name: this.name
//           }
//         };
//         db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         this.cart.items = new Array();
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectID(this.id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user.id": new mongodb.ObjectID(this.id) })
//       .toArray();
//   }
// }

// module.exports = User;
