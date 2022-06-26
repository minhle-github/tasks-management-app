import User from "../../models/User";
import { NextFunction, Request, Response } from "express";
import Logging from "../../library/Logging";

const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  /* Check if refreshToken in DB */
  const foundUser = await User.findOne({refreshTokens: refreshToken});
  if (!foundUser) {
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
    return res.sendStatus(204);
  }

  foundUser.refreshTokens = foundUser.refreshTokens?.filter(rt => rt !== refreshToken) as string[];
  const result = await foundUser.save();
  Logging.info(result);
  
  res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
  res.sendStatus(204);
}

export default {logoutHandler}