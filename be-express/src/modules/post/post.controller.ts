import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../utils/paginate/paginate';
import * as postService from './post.service';
import { historyService } from '../history';

export const createPost = catchAsync(async (req: Request, res: Response) => {
  req.body['createdBy'] = req.user._id;
  req.body['lastChangeBy'] = req.user._id;
  req.body['lastChangeAt'] = new Date();
  const post = await postService.createPost(req.body);
  await historyService.createHistory({
    changedBy: post.lastChangeBy,
    post: post._id,
    signal: post.activeSignal,
  });
  res.status(httpStatus.CREATED).send(post);
});

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['station', 'createdBy', 'activeSignal']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'search', 'populate']);
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
    req.body['lastChangeBy'] = req.user._id;
    req.body['lastChangeAt'] = new Date();
    const post = await postService.updatePostById(new mongoose.Types.ObjectId(req.params['postId']), req.body);
    if (post) {
      await historyService.createHistory({
        changedBy: post!.lastChangeBy,
        post: post!._id,
        signal: post!.activeSignal,
      });
    }
    res.send(post);
  }
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['postId'] === 'string') {
    await postService.deletePostById(new mongoose.Types.ObjectId(req.params['postId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
