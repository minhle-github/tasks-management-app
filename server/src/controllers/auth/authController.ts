import User from "../../models/User";
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { config } from "../../config/config";
import Logging from "../../library/Logging";

const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const {username, password} = req.body;
  if (!username || !password) return res.status(400).json({'message': 'Username and password are required!'});

  const foundUser = await User.findOne({username});
  if (!foundUser) return res.sendStatus(401);

  /* Evualate password */
  const match = await foundUser.comparePassword(password);
  if (!match) {
    return res.sendStatus(401);
  }

  const roles = Object.values(foundUser.roles).filter(Boolean); // filter the 'null' values out when send roles back to response

  /* Create JWTs */
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "user": foundUser._id.toString(),
        "roles": roles
      }
    },
    config.jwt.accessTokenSecret,
    {expiresIn: '10m'} // in production will be 5-10m
  );
  const newRefreshToken = jwt.sign(
    {'user': foundUser._id.toString()},
    config.jwt.refreshTokenSecret,
    { expiresIn: '1h' }
  );

  /* When user didn't log out and somehow signs in again
  then there should be a jwt cookie, which should be removed */
  const refreshTokenArray = 
    !cookies?.jwt
      ? foundUser.refreshTokens
      : foundUser.refreshTokens?.filter(rt => rt !== cookies.jwt);
  if (cookies?.jwt) {
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
  }

  /* Saving newRefreshToken to current user */
  foundUser.refreshTokens = [...refreshTokenArray as string[], newRefreshToken];
  const result = await foundUser.save();
  Logging.info(result);

  res.cookie('jwt', newRefreshToken, {
    httpOnly: true,
    sameSite: 'none',
    maxAge: 60*60*1000,
    secure: true
  });
  res.json({accessToken});
}

export default {loginHandler};