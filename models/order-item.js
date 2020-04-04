const Sequalize = require("sequelize");
const sequalizer = require("../util/database");

const OrderItem = sequalizer.define("orderItem", {
  id: {
    type: Sequalize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequalize.INTEGER
});

module.exports = OrderItem;
