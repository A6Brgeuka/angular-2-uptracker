import {UserModel} from "./user.model";

export class TokenModel {
  id: number = null;
  idUser: number = null;
  name: string = null;
  createdAt: string = null;
  updatedAt: string = null;
  ipAddress: string = null;
  user: UserModel = new UserModel();

  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
  
        switch (field) {
          case 'user':
            this[field] = new UserModel(obj[field]);
            break;
        }
      }
    }
  }
}