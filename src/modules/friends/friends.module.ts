import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFriends } from '../../entities/user-friends.entity';
import { FriendRequest } from '../../entities/friend-requests.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, UserFriends, User])],
  providers: [FriendsService, JwtService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
