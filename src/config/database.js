const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;


/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2E3M2NmYzM5NmU2OGMxN2EzY2Q0YjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzkwMTM3NzMsImV4cCI6MTczOTEwMDE3M30.agKdLbmHoyx7CCocVqUjV0Tmc04ooP5aIMcEFrXmod4
*/
