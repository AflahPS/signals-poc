import Joi from 'joi';
import { objectId } from '../utils/validate/custom.validation';
import { PostBody } from './post.interfaces';

const createPostBody: Record<keyof PostBody, any> = {
  name: Joi.string().required(),
  station: Joi.string().custom(objectId).required(),
  availableSignals: Joi.array().items(Joi.string().required()).required(),
  activeSignal: Joi.string().required(),
  lastChangeAt: Joi.string().isoDate(),
  lastChangeBy: Joi.string().custom(objectId),
  createdBy: Joi.string().custom(objectId),
};

export const createPost = {
  body: Joi.object().keys(createPostBody),
};

export const getPosts = {
  query: Joi.object().keys({
    station: Joi.string().custom(objectId),
    createdBy: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

export const updatePost = {
  params: Joi.object().keys({
    postId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      station: Joi.string().custom(objectId),
      availableSignals: Joi.array().items(Joi.string().required()),
      activeSignal: Joi.string(),
    })
    .min(1),
};

export const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};
