import User from "../../models/User";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "../../config/config";
import Logging from "../../library/Logging";

const refreshHandler = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});

  const foundUser = await User.findOne({refreshTokens: refreshToken});

  /* Refresh token is reused */
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      config.jwt.refreshTokenSecret,
      async (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findById(decoded?.user);
        if (hackedUser) {
          hackedUser.refreshTokens = [];
          const result = await hackedUser.save();
          Logging.info(result);
        }
      }
    )
    return res.sendStatus(403);
  }

  const newRefreshTokenArray = foundUser.refreshTokens?.filter(rt => rt !== refreshToken) as string[];
  /* Evaluate refresh token */
  jwt.verify(
    refreshToken,
    config.jwt.refreshTokenSecret,
    async (err: any, decoded: any) => {
      console.log(foundUser._id.toString());
      console.log(decoded.user);
      /* Refresh Token invalid */
      if (err) {
        foundUser.refreshTokens = [...newRefreshTokenArray];
        const result = await foundUser.save();
        Logging.info(result);
      }
      if (err || (foundUser._id.toString() !== decoded.user)) return res.sendStatus(403);

      /* Refresh Token valid */
      const roles = Object.values(foundUser.roles).filter(Boolean);
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "user": decoded.user,
            "roles": roles
          }
        },
        config.jwt.accessTokenSecret,
        {expiresIn: '10m'}
      );
      const newRefreshToken = jwt.sign(
        { 'user': decoded.user },
        config.jwt.refreshTokenSecret,
        { expiresIn: '1h' }
      );

      /* Saving refreshToken with current user */
      foundUser.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
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
  )
}

export default {refreshHandler};