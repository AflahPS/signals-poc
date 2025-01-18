import { model, Schema } from 'mongoose';
import toJSON from '../utils/toJSON/toJSON';
import paginate from '../utils/paginate/paginate';
import { IHistoryDoc, IHistoryModel } from './history.interfaces';

const historySchema = new Schema<IHistoryDoc, IHistoryModel>(
  {
    signal: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
historySchema.plugin(toJSON);
historySchema.plugin(paginate);

const History = model<IHistoryDoc, IHistoryModel>('History', historySchema);

export default History;
