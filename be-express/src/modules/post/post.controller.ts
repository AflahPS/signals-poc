import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../utils/paginate/paginate';
import * as postService from './post.service';

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const post = await postService.createPost(req.body);
  res.status(httpStatus.CREATED).send(post);
});

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await postService.queryPosts(filter, options);
  res.send(result);
});

export const getPost = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['postId'] === 'string') {
    const post = await postService.getPostById(new mongoose.Types.ObjectId(req.params['postId']));
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    res.send(post);
  }
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['postId'] === 'string') {
    const post = await postService.updatePostById(new mongoose.Types.ObjectId(req.params['postId']), req.body);
    res.send(post);
  }
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['postId'] === 'string') {
    await postService.deletePostById(new mongoose.Types.ObjectId(req.params['postId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
