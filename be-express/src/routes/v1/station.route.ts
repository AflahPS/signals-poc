import express, { Router } from 'express';
import { validate } from '../../modules/utils/validate';
import { auth } from '../../modules/auth';
import { stationController, stationValidation } from '../../modules/station';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(stationValidation.createStation), stationController.createStation)
  .get(auth(), validate(stationValidation.getStations), stationController.getStations);

router
  .route('/:stationId')
  .patch(auth(), validate(stationValidation.updateStation), stationController.updateStation)
  .delete(auth(), validate(stationValidation.deleteStation), stationController.deleteStation);

export default router;
