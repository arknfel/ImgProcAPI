import express from 'express';
import imagesRoute from './api/imgProc';

const routes = express.Router();

routes.use('/', imagesRoute);

export default routes;
