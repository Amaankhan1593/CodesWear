// // lib/connectDB.js
// import mongoose from "mongoose";

// const connectDB = async () => {
//   if (!process.env.MONGO_URI) {
//     throw new Error("MONGO_URI not defined in environment variables");
//   }

//   // Prevent multiple connections in development
//   if (mongoose.connections[0].readyState) {
//     return;
//   }

//   await mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// export default connectDB;


// lib/connectDB.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined in environment variables");
  }

  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(process.env.MONGO_URI); // options not needed in Mongoose 6+
};

export default connectDB;
