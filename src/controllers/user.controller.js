import logger from "../configs/logger.config.js";
import createHttpError from "http-errors";
import { searchUser as searchUserService } from "../services/user.service.js";

export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      logger.error("please add a search query first!");
      throw createHttpError.BadRequest("Oops... something went wrong!");
    }
    const users = await searchUserService(keyword);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
