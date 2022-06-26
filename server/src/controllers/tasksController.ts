import { NextFunction, Request, Response } from "express";
import Task from "../models/Task";
import Logging from "../library/Logging";
import { AuthRequest } from "../config/customRequests";

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req as AuthRequest)?.user) return res.sendStatus(403); 
  if (!req?.body?.name || !req?.body?.dueDate) return res.status(400).json({'message': 'Some required fields is missing!'});

  const userId = (req as AuthRequest).user;
  const dueDate = new Date(req.body.dueDate); 
  const task = new Task({userId});

  try {
    for (const key of Object.keys(req.body)) {
      if (key === 'dueDate') {
        task.set(key, dueDate);
      } else {
        task.set(key, req.body[key]);
      }
    }
    const result = await task.save();
    Logging.info(result);
    res.status(201).json({'success': `New task ${task.name} for user ${userId} created`});
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const readTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.taskId) return res.status(400).json({'message': 'Task ID required'});

  try {
    const task = await Task.findById(req.params.taskId).populate('userId');
    if (!task) return res.status(204).json({'message': `No task matches ID ${req.params.taskId}`});

    res.json(task);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const readAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req as AuthRequest)?.user) return res.sendStatus(403);
  try {
    const tasks = await Task.find({userId: (req as AuthRequest).user}).populate('userId');
    if (!tasks) return res.status(204).json({'message': 'No task found'});

    res.json(tasks);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.taskId) return res.status(400).json({'message': 'Task ID required'});

  try {
    const task = await Task.findById(req.params.taskId);
    
    if (task) {
      for (const key of Object.keys(req.body)) {
        if (key === 'dueDate') {
          task.set(key, new Date(req.body[key]));
        } else {
          task.set(key, req.body[key]);
        }
      }
      const result = await task.save();
      Logging.info(result);
      res.json(result);
    }
    if (!task) {
      res.status(204).json({'message': 'No matches ID task found'});
    }
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.taskId) return res.status(400).json({'message': 'Task ID required'});

  try {
    const task = await Task.findOne({_id: req.params.taskId});
    if (!task) return res.status(204).json({'message': `No task matches ID ${req.params.taskId}`})

    const result = await Task.deleteOne({_id: req.params.taskId});
    Logging.info(result);
    res.json(result);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

export default {
  deleteTask,
  createTask,
  readAllTasks,
  readTask,
  updateTask
}