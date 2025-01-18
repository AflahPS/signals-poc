import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import stationRoute from './station.route';
import postRoute from './post.route';
import historyRoute from './history.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/stations',
    route: stationRoute,
  },
  {
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/history',
    route: historyRoute,
  },
];


defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
