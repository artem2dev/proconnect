import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFriends } from './user-friends.entity';
import { FriendRequest } from './friend-requests.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, UserFriends])],
  providers: [FriendsService, JwtService],
  controllers: [FriendsController],
})
export class FriendsModule {}
