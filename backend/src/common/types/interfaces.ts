import { Socket } from 'socket.io';

export interface IExtendedRequestWithUser extends Request {
  user: IUserIdAndEmail;
}

export interface IUserIdAndEmail extends Request {
  id: string;
  email: string;
}

export interface I_Id {
  id: string;
}

export interface IExtendedSocket extends Socket {
  userId: string;
}

export interface IMessage {
  text: string;
  userId: string;
}

export interface IUserInChatInfo {
  id: string;
  firstName: string;
  lastName: string;
  avatarId: string;
}
