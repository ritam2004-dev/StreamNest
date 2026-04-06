import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      `\nConnected to MongoDB database!! DB HOST: ${connectionInstance.connection.host}`
    );

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;