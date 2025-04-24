import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { IExtendedRequestWithUser } from '../../common/types/interfaces';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@UseGuards(AccessTokenGuard)
@Controller('messages')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/chats')
  async getChats(@Request() req: IExtendedRequestWithUser) {
    return await this.chatService.getChats(req.user?.id);
  }

  @Get(':userId')
  async getMessages(@Request() req: IExtendedRequestWithUser, @Param('userId') userId: string) {
    return await this.chatService.getSingleMessages(req.user?.id, userId);
  }
}
