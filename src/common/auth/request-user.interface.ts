import { Request } from 'express';
import { User } from 'src/modules/user/entities';
 
export interface RequestUser extends Request {
  user: User;
}