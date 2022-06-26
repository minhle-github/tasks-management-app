import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import { AuthRequest } from "../config/customRequests";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization as string || req.headers.Authorization as string;

  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({'message': 'Unauthorized'});
  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    config.jwt.accessTokenSecret,
    (err, decoded: any) => {
      if (err) return res.status(403).json({'message': 'Forbinden'});
      (req as AuthRequest).user = decoded.UserInfo.user;
      next();
    }
  )
}

export default verifyJWT;