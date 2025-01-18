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
