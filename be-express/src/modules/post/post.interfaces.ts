import { Types, Model, Document } from 'mongoose';
import { QueryResult } from '../utils/paginate/paginate';

export interface IPost {
  name: string;
  station: Types.ObjectId;
  availableSignals: string[];
  activeSignal: string;
  lastChangeAt: Date;
  lastChangeBy: Types.ObjectId;
  createdBy: Types.ObjectId;
}

export interface IPostDoc extends IPost, Document {}

export interface IPostModel extends Model<IPostDoc> {
  isNameTaken(name: string, station: Types.ObjectId, excludePostId?: Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>, searchKeys?: (keyof IPost)[]): Promise<QueryResult>;
}

export type PostBody = Partial<IPost>;
