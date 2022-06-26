import { IUser } from '../../src/api/users/entities/user.entity';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser | undefined;
    }
  }
}
