import express, { Router } from 'express';
import { validate } from '../../modules/utils/validate';
import { auth } from '../../modules/auth';
import { historyController, historyValidation } from '../../modules/history';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(historyValidation.createHistory), historyController.createHistory)
  .get(auth(), validate(historyValidation.getHistory), historyController.getHistory);

export default router;
