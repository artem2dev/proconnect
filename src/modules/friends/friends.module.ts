import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FriendsController])],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
