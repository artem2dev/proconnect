import { Socket } from 'socket.io';

export interface IExtendedRequestWithUser extends Request {
  user: IUserIdAndEmail;
}

export interface IUserIdAndEmail extends Request {
  id: string;
  email: string;
}

export interface IId {
  id: string;
}

export interface IExtendedSocket extends Socket {
  userId: string;
}
