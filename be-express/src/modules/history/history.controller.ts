import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';
import { IOptions } from '../utils/paginate/paginate';
import * as historyService from './history.service';

export const createHistory = catchAsync(async (req: Request, res: Response) => {
  const history = await historyService.createHistory(req.body);
  res.status(httpStatus.CREATED).send(history);
});

export const getHistory = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['post', 'changedBy', 'signal']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'search', 'populate']);
  const result = await historyService.queryHistorys(filter, options);
  res.send(result);
});
