import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";

export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (config.server.allowedOrigins.includes(origin as string)) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
}