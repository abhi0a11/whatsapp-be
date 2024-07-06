import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

//env variables
const { DEFAULT_PIC, DEFAULT_STATUS } = process.env;

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;

  //check if fields are empty
  if (!name || !email || !password) {
    throw createHttpError.Conflict("Please fill all fields.");
  }

  //check name length(with validator)
  if (
    !validator.isLength(name, {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure that your name is between 2 and 16 characters."
    );
  }

  //check status length(without validator)
  if (status.length > 40) {
    throw createHttpError.BadRequest(
      "Please make sure that your name is between 2 and 16 characters."
    );
  }

  //check if email address valid or not
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Enter a valid email address");
  }

  //check user if already exist
  const checkdb = await UserModel.findOne({ email });
  if (checkdb) {
    throw createHttpError.BadRequest("Email address already exists.");
  }

  //check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure that your password is between 6 and 128 characters."
    );
  }

  //adding user to database
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PIC,
    status: status || DEFAULT_STATUS,
    password,
  }).save();

  return user;
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  //check if email/user exists
  if (!user) throw createHttpError.NotFound("Invalid Credentials.");

  //compare passwords
  let passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw createHttpError.NotFound("Invalid Credentials.");

  return user;
};
