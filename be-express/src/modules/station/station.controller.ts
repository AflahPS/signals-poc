import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';
import { IOptions } from '../utils/paginate/paginate';
import * as stationService from './station.service';

export const createStation = catchAsync(async (req: Request, res: Response) => {
  req.body['createdBy'] = req.user._id;
  const station = await stationService.createStation(req.body);
  res.status(httpStatus.CREATED).send(station);
});

export const getStations = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['createdBy']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await stationService.queryStations(filter, options);
  res.send(result);
});

export const updateStation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stationId'] === 'string') {
    const station = await stationService.updateStationById(new mongoose.Types.ObjectId(req.params['stationId']), req.body);
    res.send(station);
  }
});

export const deleteStation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stationId'] === 'string') {
    await stationService.deleteStationById(new mongoose.Types.ObjectId(req.params['stationId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
