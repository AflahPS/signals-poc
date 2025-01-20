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
  const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
  const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy ?? 'updatedAt:desc';
  const additionalSorting = sortBy?.includes(':')
    ? { [sortBy.split(':')[0]!]: sortBy.split(':')[1] === 'desc' ? -1 : 1 }
    : {};

  if (filter?.['station']) filter['station'] = new Types.ObjectId(filter['station']);
  if (filter?.['lastChangeBy']) filter['lastChangeBy'] = new Types.ObjectId(filter['lastChangeBy']);
  if (filter?.['createdBy']) filter['createdBy'] = new Types.ObjectId(filter['createdBy']);
  filter['isDeleted'] = false;

  const pipeline: any[] = [
    { $match: filter },
    {
      $addFields: {
        priority: {
          $cond: { if: { $eq: ['$activeSignal', 'red'] }, then: 0, else: 1 },
        },
        id: '$_id',
      },
    },
    { $sort: { priority: 1, ...additionalSorting } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'lastChangeBy',
        foreignField: '_id',
        as: 'lastChangeBy',
      },
    },
    {
      $unwind: {
        path: '$lastChangeBy',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'lastChangeBy.password': 0,
      },
    },
  ];

  const countPromise = Post.countDocuments(filter).exec();
  const docsPromise = Post.aggregate(pipeline).exec();
  const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results,
    page,
    limit,
    totalPages,
    totalResults,
  };
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
  post.isDeleted = true;
  await post.save();
  return post;
};
