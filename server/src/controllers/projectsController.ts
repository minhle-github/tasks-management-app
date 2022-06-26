import { NextFunction, Request, Response } from "express";
import Project from "../models/Project";
import Logging from "../library/Logging";
import { AuthRequest } from "../config/customRequests";
import Task from "../models/Task";

const createProject = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req as AuthRequest)?.user) return res.sendStatus(403); 
  if (!req?.body?.name) return res.status(400).json({'message': 'Projects name is missing!'});

  const userId = (req as AuthRequest).user;
  const project = new Project({userId});

  try {
    for (const key of Object.keys(req.body)) {
      project.set(key, req.body[key]);
    }
    const result = await project.save();
    Logging.info(result);
    res.status(201).json({'success': `New project ${project.name} for user ${userId} created`});
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const readProject = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.projectId) return res.status(400).json({'message': 'Task ID required'});

  try {
    const project = await Project.findById(req.params.projectId).populate('userId');
    if (!project) return res.status(204).json({'message': `No project matches ID ${req.params.projectId}`});

    res.json(project);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const readAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req as AuthRequest)?.user) return res.sendStatus(403);
  try {
    const projects = await Project.find({userId: (req as AuthRequest).user}).populate('userId');
    if (!projects) return res.status(204).json({'message': 'No project found'});

    res.json(projects);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.projectId) return res.status(400).json({'message': 'Task ID required'});

  try {
    const project = await Project.findById(req.params.projectId);
    
    if (project) {
      for (const key of Object.keys(req.body)) {
        project.set(key, req.body[key]);
      }
      const result = await project.save();
      Logging.info(result);
      res.json(result);
    }
    if (!project) {
      res.status(204).json({'message': 'No matches ID project found'});
    }
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.projectId) return res.status(400).json({'message': 'Project ID required'});

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(204).json({'message': `No project matches ID ${req.params.projectId}`});

    await Task.deleteMany({projectId: req.params.projectId});

    const result = await Project.deleteOne({_id: req.params.projectId});
    Logging.info(result);
    res.json(result);
  } catch (err) {
    Logging.error(err);
    res.status(500).json({'message': err});
  }
}

export default {
  deleteProject,
  createProject,
  readAllProjects,
  readProject,
  updateProject
}