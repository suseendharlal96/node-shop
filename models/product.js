const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imageurl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(product) {
//     this.title = product.title;
//     this.imageurl = product.imageurl;
//     this.price = product.price;
//     this.description = product.description;
//     this.userId = product.userId;
//   }

//   saveProduct() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .insertOne(this)
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => console.log(err));
//   }

//   static fetchProducts() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(err => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectID(prodId) })
//       .next()
//       .then(product => {
//         return product;
//       })
//       .catch(err => console.log(err));
//   }

//   static updateProduct(product) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .updateOne(
//         { _id: new mongodb.ObjectID(product.id) },
//         {
//           $set: {
//             title: product.title,
//             imageurl: product.imageurl,
//             price: product.price,
//             description: product.description
//           },
//           $currentDate: { lastModified: true }
//         }
//       )
//       .then(product => {
//         return product;
//       })
//       .catch(err => console.log(err));
//   }

//   static deleteProduct(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectID(id) })
//       .then(product => {
//         console.log(product);
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = Product;
