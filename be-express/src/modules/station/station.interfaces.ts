import mongoose, { Model, Document, Types } from 'mongoose';
import { IOptions, QueryResult } from '../utils/paginate/paginate';

export interface IStation {
  name: string;
  createdBy: Types.ObjectId;
}

export interface IStationDoc extends IStation, Document {}

export interface IStationModel extends Model<IStationDoc> {
  isNameTaken(name: string, excludeStationId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: IOptions,  searchKeys?: (keyof IStation)[]): Promise<QueryResult>;
}

export type StationBody = Partial<IStation>;
