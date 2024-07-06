import { sign, verify } from "../utils/token.utils.js";
export const generateToken = async (payload, expiresIn, secret) => {
  let token = await sign(payload, expiresIn, secret);
  return token;
};

export const verifyToken = async (token, secret) => {
  const check = await verify(token, secret);
  return check;
};
