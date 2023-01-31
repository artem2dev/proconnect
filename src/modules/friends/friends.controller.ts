import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserBody } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IId } from 'src/common/types/interfaces';
import { FriendsService } from './friends.service';

@ApiTags('Friends')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get('requests')
  getAllFriendRequests(@UserBody() user: IId) {
    return this.friendsService.getAllFriendRequests(user);
  }

  @Get(':userName')
  getAllFriends(@Param('userName') userName: string) {
    return this.friendsService.getAllFriends(userName);
  }

  @Post('add/:userId')
  createFriendRequest(@Param('userId') userId: string, @UserBody() user: IId) {
    return this.friendsService.createFriendRequest(user, { id: userId });
  }

  @Post('decline/:friendRequestId')
  declineFriendRequest(@UserBody() user: IId, @Param('friendRequestId') friendRequestId: string) {
    return this.friendsService.declineFriendRequest(user, friendRequestId);
  }

  @Post('accept/:friendRequestId')
  acceptFriendRequest(@UserBody() user: IId, @Param('friendRequestId') friendRequestId: string) {
    return this.friendsService.acceptFriendRequest(user, friendRequestId);
  }

  @Delete('cancel-request/:friendRequestId')
  deleteFriendRequest(@UserBody() user: IId, @Param('friendRequestId') friendRequestId: string) {
    return this.friendsService.deleteFriendRequest(user, friendRequestId);
  }

  @Delete('delete/:friendId')
  removeFromFriends(@UserBody() user: IId, @Param('friendId') friendId: string) {
    return this.friendsService.removeFromFriends(user, friendId);
  }
}
