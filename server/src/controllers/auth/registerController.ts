import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import Logging from "../../library/Logging";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.body?.username || !req?.body?.password || !req?.body?.firstname || !req?.body?.lastname || !req?.body?.email) return res.status(400).json({'message': 'Some fields is missing!'});

  const {username, password, firstname, lastname, email} = req.body;

  /* Check for duplicate Usernames or Emails in DB */
  const duplicatedUsername = await User.findOne({username}).exec();
  const duplicatedEmail = await User.findOne({email}).exec();
  if (duplicatedUsername || duplicatedEmail) return res.sendStatus(409);

  try {
    const result = await User.create({
      firstname,
      lastname,
      username,
      password,
      email
    });
    Logging.info(result);
    res.status(201).json({'success': `New user ${username} created`});
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

export default {createUser};
