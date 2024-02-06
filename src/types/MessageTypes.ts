import {Types} from 'mongoose';
import {UserOutput} from './DBTypes';

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type PostMessage = MessageResponse & {
  _id: Types.ObjectId;
};

type LoginResponse = {
  token: string;
  user: UserOutput;
};

export {MessageResponse, ErrorResponse, PostMessage, LoginResponse};
