import { Controller, Param, Post, Req } from '@nestjs/common';
import { IGetUserInfoRequest } from 'src/common/types/user';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post(':userId')
  addFriend(@Param(':userId') userId: string, @Req() req: IGetUserInfoRequest) {
    return this.friendsService.createFriendRequest(req.user.id, userId);
  }
}
