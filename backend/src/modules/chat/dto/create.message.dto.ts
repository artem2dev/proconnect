import { IMessage, IUserInChatInfo } from 'src/common/types/interfaces';

export class CreateMessageDto {
  message: Required<IMessage>;

  roomId: string;

  user1: Required<IUserInChatInfo>;

  user2: Required<IUserInChatInfo>;
}
