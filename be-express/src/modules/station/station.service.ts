import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Station from './station.model';
import ApiError from '../utils/errors/ApiError';
import { IOptions, QueryResult } from '../utils/paginate/paginate';
import { StationBody, IStationDoc } from './station.interfaces';

/**
 * Create a station
 * @param {StationBody} stationBody
 * @returns {Promise<IStationDoc>}
 */
export const createStation = async (stationBody: StationBody): Promise<IStationDoc> => {
  if (await Station.isNameTaken(stationBody.name!)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return Station.create(stationBody);
};

/**
 * Query for stations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryStations = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const stations = await Station.paginate(filter, options);
  return stations;
};

/**
 * Get station by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IStationDoc | null>}
 */
export const getStationById = async (id: mongoose.Types.ObjectId): Promise<IStationDoc | null> => Station.findById(id);

/**
 * Update station by id
 * @param {mongoose.Types.ObjectId} stationId
 * @param {UpdateStationBody} updateBody
 * @returns {Promise<IStationDoc | null>}
 */
export const updateStationById = async (
  stationId: mongoose.Types.ObjectId,
  updateBody: StationBody
): Promise<IStationDoc | null> => {
  const station = await getStationById(stationId);
  if (!station) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Station not found');
  }
  if (updateBody.name && (await Station.isNameTaken(updateBody.name, stationId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(station, updateBody);
  await station.save();
  return station;
};

/**
 * Delete station by id
 * @param {mongoose.Types.ObjectId} stationId
 * @returns {Promise<IStationDoc | null>}
 */
export const deleteStationById = async (stationId: mongoose.Types.ObjectId): Promise<IStationDoc | null> => {
  const station = await getStationById(stationId);
  if (!station) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Station not found');
  }
  await station.deleteOne();
  return station;
};
