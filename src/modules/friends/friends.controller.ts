import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserBody } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IGetUser } from 'src/common/types/user';
import { FriendsService } from './friends.service';

@UseGuards(AccessTokenGuard)
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get('requests')
  getAllFriendRequests(@UserBody() user: IGetUser) {
    return this.friendsService.getAllFriendRequests(user);
  }

  @Get(':userName')
  getAllFriends(@UserBody() user: IGetUser, @Param('userName') userName: string) {
    return this.friendsService.getAllFriends(userName);
  }

  @Post('add/:userId')
  createFriendRequest(@Param('userId') userId: string, @UserBody() user: IGetUser) {
    return this.friendsService.createFriendRequest(user, { id: userId });
  }

  @Post('decline/:friendRequestId')
  declineFriendRequest(@UserBody() user: IGetUser, @Param('friendRequestId') friendRequestId: string) {
    return this.friendsService.declineFriendRequest(user, friendRequestId);
  }

  @Post('accept/:friendRequestId')
  acceptFriendRequest(@UserBody() user: IGetUser, @Param('friendRequestId') friendRequestId: string) {
    return this.friendsService.acceptFriendRequest(user, friendRequestId);
  }

  @Delete('cancel-request/:friendRequestId')
  deleteFriendRequest(@UserBody() user: IGetUser, @Param('friendRequestId') friendRequestId: string) {
    return this.friendsService.deleteFriendRequest(user, friendRequestId);
  }

  @Delete('delete/:friendId')
  removeFromFriends(@UserBody() user: IGetUser, @Param('friendId') friendId: string) {
    return this.friendsService.removeFromFriends(user, friendId);
  }
}
