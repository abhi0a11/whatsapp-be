import logger from "./configs/logger.config.js";
import mongoose from "mongoose";

//env variables
const { MONGO_URL } = process.env;

// mongodb connection
const connectToMongo = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.info("connected to mongoDB database.");
    });

  //exit on mongodb error
  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  //mongodb debug mode
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
};

export default connectToMongo;
