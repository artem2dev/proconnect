import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IExtendedSocket } from '../../common/types/interfaces';
import { UserService } from '../users/user.service';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create.message.dto';
import { ReadChatDto } from './dto/read.chat.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService, private userService: UserService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleSendMessage(socket: IExtendedSocket, data: CreateMessageDto): Promise<void> {
    console.info('Send message in chat:', data);

    const message = await this.chatService.createMessage(data);

    this.server.to(data.roomId).emit('message', { ...data, message });
  }

  @SubscribeMessage('chatRead')
  async handleChatRead(socket: IExtendedSocket, data: ReadChatDto): Promise<void> {
    await this.chatService.handleReadChat(data);

    this.server.to(data.roomId).emit('chatRead', data);
  }

  afterInit() {
    this.server.use(async (socket: IExtendedSocket, next) => {
      const userId = socket.handshake.auth.userId;

      socket.userId = userId;

      next();
    });
  }

  async handleConnection(socket: IExtendedSocket) {
    const rooms = await this.chatService.getSingleChats(socket.userId);
    await this.userService.toggleUserOnline(socket.userId);

    socket.join(rooms);

    console.info('\x1b[32m', `Connected to room(s): ${rooms}`);
  }

  async handleDisconnect(socket: IExtendedSocket) {
    await this.userService.toggleUserOnline(socket.userId);

    console.info('\x1b[31m', `Disconnected user: ${socket.userId}`);
  }
}
