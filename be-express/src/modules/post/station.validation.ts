import Joi from 'joi';
import { objectId } from '../utils/validate/custom.validation';
import { StationBody } from './post.interfaces';

const createStationBody: Record<keyof StationBody, any> = {
  name: Joi.string().required(),
  edges: Joi.array().items(Joi.string().required()),
};

export const createStation = {
  body: Joi.object().keys(createStationBody),
};

export const getStations = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getStation = {
  params: Joi.object().keys({
    stationId: Joi.string().custom(objectId),
  }),
};

export const updateStation = {
  params: Joi.object().keys({
    stationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      edges: createStationBody.edges,
      name: Joi.string(),
    })
    .min(1),
};

export const deleteStation = {
  params: Joi.object().keys({
    stationId: Joi.string().custom(objectId),
  }),
};
