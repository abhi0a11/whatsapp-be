import SocketServer from "./SocketServer.js";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import connectToMongo from "./db.js";
import { Server } from "socket.io";

//mongodb connection
connectToMongo();

//env variables
const PORT = process.env.PORT;

let server;
server = app.listen(PORT, () => {
  logger.info(`Server is listening at ${PORT}`);
  //   throw new Error("error in server");
});

//socket.io server
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  logger.info("socket io connected succesfully");
  SocketServer(socket, io);
});

const exitHandler = () => {
  if (server) {
    logger.info("Server Closed");
    process.exit(1);
    //if exit code = 1, exited with an error, if 0, exited without error
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server Closed");
    process.exit(1);
    //if exit code = 1, exited with an error, if 0, exited without error
  }
});
