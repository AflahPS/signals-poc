import httpStatus from 'http-status';
import { Types } from 'mongoose';
import Post from './post.model';
import ApiError from '../utils/errors/ApiError';
import { IOptions, QueryResult } from '../utils/paginate/paginate';
import { PostBody, IPostDoc } from './post.interfaces';

/**
 * Create a post
 * @param {PostBody} postBody
 * @returns {Promise<IPostDoc>}
 */
export const createPost = async (postBody: PostBody): Promise<IPostDoc> => {
  if (await Post.isNameTaken(postBody.name!, new Types.ObjectId(postBody.station!))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return Post.create(postBody);
};

/**
 * Query for posts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryPosts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const posts = await Post.paginate(filter, options, ['name']);
  return posts;
};

/**
 * Get post by id
 * @param {Types.ObjectId} id
 * @returns {Promise<IPostDoc | null>}
 */
export const getPostById = async (id: Types.ObjectId): Promise<IPostDoc | null> => Post.findById(id);

/**
 * Update post by id
 * @param {Types.ObjectId} postId
 * @param {UpdatePostBody} updateBody
 * @returns {Promise<IPostDoc | null>}
 */
export const updatePostById = async (postId: Types.ObjectId, updateBody: PostBody): Promise<IPostDoc | null> => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (updateBody.name && (await Post.isNameTaken(updateBody.name, new Types.ObjectId(updateBody.station), postId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(post, updateBody);
  await post.save();
  return post;
};

/**
 * Delete post by id
 * @param {Types.ObjectId} postId
 * @returns {Promise<IPostDoc | null>}
 */
export const deletePostById = async (postId: Types.ObjectId): Promise<IPostDoc | null> => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await post.deleteOne();
  return post;
};
