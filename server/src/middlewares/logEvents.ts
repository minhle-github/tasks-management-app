import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";

export const logEvents = (req: Request, res: Response, next: NextFunction) => {
  /* Log the request */
  Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
    /* Log the response */
    Logging.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
  })

  next();
}