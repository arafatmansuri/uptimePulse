import { Router } from 'express';
import websitesRouter from './website';
import usersRouter from './user';

const v1Router = Router();

v1Router.use('/websites', websitesRouter);
v1Router.use('/users', usersRouter);

export default v1Router;