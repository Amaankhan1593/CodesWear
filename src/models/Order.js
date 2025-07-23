// // getting-started.js
// const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//     userId: {type: String, required: true},
//     product: [{
//             productId: {type: String},
//             quantity: {type: Number, default: 1}
//         }],
//     address: {type: String, required: true},
//     amount: {type: Number, required: true},
//     status: {type: String, default: 'Pending', required: true}
//   }, {timestamp: true});

// mongoose.models = {}
  
// export default mongoose.model("Order", OrderSchema);

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  product: [
    {
      productId: { type: String },
      quantity: { type: Number, default: 1 },
    },
  ],
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending', required: true },
}, { timestamps: true }); // <-- corrected key: timestamps (not "timestamp")

// Prevent model overwrite issue in dev
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
