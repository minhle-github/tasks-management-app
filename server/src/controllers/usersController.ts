import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import Logging from "../library/Logging";

const readUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.userId) return res.status(400).json({'message': 'User ID required'});

  try {
    const user = await User.findOne({_id: req.params.userId});
    if (!user) return res.status(204).json({'message': `No user matches ID ${req.params.userId}`});

    res.json(user);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const readAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    if (!users) return res.status(204).json({'message': 'No user found'});

    res.json(users);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.userId) return res.status(400).json({'message': 'User ID required'});

  try {
    const user = await User.findById(req.params.userId);
    
    try {
      if (user) {
        for (const key of Object.keys(req.body)) {
          user.set(key, req.body[key]);
        }
        const result = await user.save();
        Logging.info(result);
        res.json(result);
      }
    } catch (err: any) {
      Logging.error(err);
      res.status(500).json({'message': err.message});
    }

    if (!user) {
      res.status(204).json({'message': 'No matches ID user found'});
    }
    
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.userId) return res.status(400).json({'message': 'User ID required'});

  try {
    const user = await User.findOne({_id: req.params.userId});
    if (!user) return res.status(204).json({'message': `No user matches ID ${req.params.userId}`})

    const result = await User.deleteOne({_id: req.params.userId});
    Logging.info(result);
    res.json(result);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

export default {
  readUser,
  readAllUsers,
  updateUser,
  deleteUser
}