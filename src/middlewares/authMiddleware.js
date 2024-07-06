import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async function (req, res, next) {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized("please login"));

  const bearerToken = req.headers["authorization"];
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError.Unauthorized("please login"));
    }
    req.user = payload;
    next();
  });
}
