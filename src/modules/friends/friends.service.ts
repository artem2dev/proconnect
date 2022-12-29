import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { FriendRequest } from './friend-requests.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async createFriendRequest(requestorId: string, requesteeId: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({
      where: [
        { requestee: requesteeId, requester: requestorId },
        { requestee: requestorId, requester: requesteeId },
      ],
    });

    if (foundFriendRequest) {
      throw new ConflictException('Friend request already exists.');
    }
  }
}
