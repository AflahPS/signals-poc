import mongoose, { ObjectId, Schema } from 'mongoose';
import toJSON from '../utils/toJSON/toJSON';
import paginate from '../utils/paginate/paginate';
import { IPostDoc, IPostModel } from './post.interfaces';

const postSchema = new Schema<IPostDoc, IPostModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    station: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Station'
    },
    availableSignals: {
      type: [String],
      required: true,
    },
    activeSignal: {
      type: String,
      required: true,
    },
    lastChangeAt: {
      type: Date,
      default: new Date(),
    },
    lastChangeBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);
postSchema.plugin(paginate);

/**
 * Check if name is taken for the station
 * @param {string} name - The post's name
 * @param {ObjectId} [excludePostId] - The id of the post to be excluded
 * @returns {Promise<boolean>}
 */
postSchema.static(
  'isNameTaken',
  async function (name: string, station: ObjectId, excludePostId: ObjectId): Promise<boolean> {
    const post = await this.findOne({ name, station, _id: { $ne: excludePostId } });
    return !!post;
  }
);

const Post = mongoose.model<IPostDoc, IPostModel>('Post', postSchema);

export default Post;
