export interface MongoDoc {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export interface IUser extends MongoDoc {
  name: string;
  email: string;
  password?: string;
}

export interface IStation extends MongoDoc {
  name: string;
  createdBy: string;
}

export interface IPost extends MongoDoc {
  name: string;
  station: string;
  availableSignals: string[];
  activeSignal: string;
  lastChangeAt: Date;
  lastChangeBy: string;
  createdBy: string;
}

export interface IPostPopulated extends MongoDoc {
  name: string;
  station: IStation;
  availableSignals: string[];
  activeSignal: string;
  lastChangeAt: Date;
  lastChangeBy: IUser;
  createdBy: IUser;
}

export interface IHistory extends MongoDoc {
  signal: string;
  post: string;
  changedBy: string;
}
