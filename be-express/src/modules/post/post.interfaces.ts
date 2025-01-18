import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../utils/paginate/paginate';

export interface IPost {
  name: string;
  edges: string[];
}

export interface IPostDoc extends IPost, Document {}

export interface IPostModel extends Model<IPostDoc> {
  isNameTaken(name: string, excludePostId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type PostBody = Partial<IPost>;
