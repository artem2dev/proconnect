import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IExtendedSocket } from 'src/common/types/interfaces';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send.message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleSendMessage(socket: IExtendedSocket, messageInfo: SendMessageDto): Promise<void> {
    this.server.to(messageInfo.recipient.id).emit('message', messageInfo);

    await this.chatService.createMessage(messageInfo);
  }

  afterInit() {
    this.server.use(async (socket: IExtendedSocket, next) => {
      const userId = socket.handshake.auth.userId;

      socket.userId = userId;

      next();
    });
  }

  handleConnection(socket: IExtendedSocket) {
    socket.join(socket.userId);

    console.info('\x1b[32m', `Connected: ${socket.userId}`);
  }

  handleDisconnect(socket: IExtendedSocket) {
    console.info('\x1b[31m', `Disconnected: ${socket.userId}`);
  }
}
