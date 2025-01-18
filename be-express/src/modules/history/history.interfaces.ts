import { Model, Document, Types } from 'mongoose';
import { QueryResult } from '../utils/paginate/paginate';

export interface IHistory {
  signal: string;
  post: Types.ObjectId;
  changedBy: Types.ObjectId;
}

export interface IHistoryDoc extends IHistory, Document {}

export interface IHistoryModel extends Model<IHistoryDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type HistoryBody = Partial<IHistory>;
