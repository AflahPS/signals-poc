import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import stationRoute from './station.route';

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
];


defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
