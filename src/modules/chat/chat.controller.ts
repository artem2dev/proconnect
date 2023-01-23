import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IGetUserInfoRequest } from 'src/common/types/user';
import { ChatService } from './chat.service';

@UseGuards(AccessTokenGuard)
@Controller('messages')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/kd')
  async getListOfRecipientsWithLastMessage(@Request() req: IGetUserInfoRequest, @Param('userName') userName: string) {
    return await this.chatService.getListOfRecipientsWithLastMessage(req.user?.id, userName);
  }

  @Get(':userId')
  async getMessages(@Request() req: IGetUserInfoRequest, @Param('userId') userId: string) {
    return await this.chatService.getMessages(req.user?.id, userId);
  }
}
