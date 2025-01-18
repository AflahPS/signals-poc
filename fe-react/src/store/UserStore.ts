import { action, makeObservable, observable } from 'mobx';
import { IUser } from '../models';

export class UserStore {
  user: IUser | undefined;

  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action,
    });
  }

  setUser = (user: IUser | undefined) => {
    this.user = user;
  };
}
export const userStore = new UserStore();
