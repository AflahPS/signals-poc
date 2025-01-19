import Joi from 'joi';
import { objectId } from '../utils/validate/custom.validation';
import { HistoryBody } from './history.interfaces';

const createHistoryBody: Record<keyof HistoryBody, any> = {
  signal: Joi.string().required(),
  post: Joi.string().custom(objectId).required(),
  changedBy: Joi.string().custom(objectId),
};

export const createHistory = {
  body: Joi.object().keys(createHistoryBody),
};

export const getHistory = {
  query: Joi.object().keys({
    post: Joi.string().custom(objectId),
    changedBy: Joi.string().custom(objectId),
    signal: Joi.string(),
    search: Joi.string(),
    populate: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
