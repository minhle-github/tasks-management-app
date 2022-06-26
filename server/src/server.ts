import express, { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';

import { config } from './config/config';
import { connectDB } from './config/dbConn';

import { logEvents } from './middlewares/logEvents';
import verifyJWT from './middlewares/verifyJWT';

import Logging from './library/Logging';

import authRoute from './routes/auth/auth';
import logoutRoute from './routes/auth/logout';
import refreshRoute from './routes/auth/refresh';
import registerRoute from './routes/auth/register';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';
import projectRoutes from './routes/projects';

import cors from 'cors';
import cookieParser from "cookie-parser"
import { credentials } from './middlewares/credentials';

const app = express();

/* Connect to MongoDB */
connectDB();

/* Middlewares */
app.use(logEvents);
app.use(credentials);
app.use(cors(config.server.corsOptions));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

/* Healthcheck */
app.get('/ping', (req: Request, res: Response, next: NextFunction) => res.status(200).json({message: 'pong'}));

/* Routes */
app.use('/register', registerRoute);
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);
app.use('/logout', logoutRoute);
/* Protected Routes */
app.use(verifyJWT);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);

/* Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('not found');
  Logging.error(error);

  return res.status(404).json({message: error.message});
});

/* Connect to MongoDB and start server */
mongoose.connection.once('connected', () => {
  Logging.info('Connected to MongoDB');
  app.listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`))
})