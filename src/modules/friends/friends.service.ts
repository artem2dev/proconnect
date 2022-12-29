import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionDictionary } from 'src/common/dictionary/ExceptionDictonary';
import { Repository } from 'typeorm';
import { FriendRequest } from './friend-requests.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async createFriendRequest(requestor: string, requestee: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({
      where: [
        { requestee, requestor },
        { requestee: requestor, requestor: requestee },
      ],
    });

    if (foundFriendRequest) {
      throw new ConflictException(ExceptionDictionary.friendRequest.alreadyExists);
    }

    const friendRequest = this.friendRequestRepository
      .create({
        requestor: requestor,
        requestee,
      })
      .save();

    return friendRequest;
  }

  async deleteFriendRequest(friendRequestId: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({ where: { id: friendRequestId } });

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    foundFriendRequest.remove();

    return {};
  }
}
