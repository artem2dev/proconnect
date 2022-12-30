import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionDictionary } from 'src/common/dictionary/ExceptionDictionary';
import { IGetUser } from 'src/common/types/user';
import { Repository } from 'typeorm';
import { FriendRequest } from './friend-requests.entity';
import { UserFriends } from './user-friends.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(UserFriends)
    private userFriendsRepository: Repository<UserFriends>,
  ) {}
  async getAllFriendRequests(user: IGetUser) {
    return this.friendRequestRepository.find({ where: { requestee: user.id } });
  }

  async getAllFriends(user: IGetUser) {
    return this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .where('uf.user1 = :userId OR uf.user2 = :userId', { userId: user.id })
      .getMany();
  }
  /**
   * Creates friends request from requestor to requestee.
   * @param requestor - user id that requests friendship.
   * @param requestee - user id to be requested friendship of.
   */
  async createFriendRequest(requestor: string, requestee: string) {
    const foundFriendRequest = await this.friendRequestRepository
      .createQueryBuilder('fr')
      .select()
      .where(
        '(fr.requestee = :requestor AND fr.requestor = :requestee) OR (fr.requestee = :requestee AND fr.requestor = :requestor) ',
        { requestor, requestee },
      )
      .getOne();

    if (foundFriendRequest) {
      throw new ConflictException(ExceptionDictionary.friendRequest.alreadyExists);
    }

    const friendRequest = await this.friendRequestRepository
      .create({
        requestor: requestor,
        requestee,
      })
      .save();

    return friendRequest;
  }

  async deleteFriendRequest(user: IGetUser, friendRequestId: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({
      where: { id: friendRequestId, requestor: user.id },
    });

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    await foundFriendRequest.remove();

    return {};
  }

  async declineFriendRequest(user: IGetUser, friendRequestId: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({ where: { id: friendRequestId } });

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    await foundFriendRequest.remove();

    return {};
  }

  async acceptFriendRequest(user: IGetUser, friendRequestId: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({
      where: { id: friendRequestId, requestee: user.id },
    });

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    return await this.userFriendsRepository.create({ user1: user.id, user2: foundFriendRequest.requestor }).save();
  }

  async removeFromFriends(user: IGetUser, friendId: string) {
    const foundFriendRequest = await this.userFriendsRepository
      .createQueryBuilder('fr')
      .select()
      .where(
        `
      (fr.user1 = :userId AND fr.user2 = :friendId)
      OR
      (fr.user2 = :userId AND fr.user1 = :friendId)
      `,
        { userId: user.id, friendId },
      )
      .getOne();

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    await foundFriendRequest.remove();

    return {};
  }
}
