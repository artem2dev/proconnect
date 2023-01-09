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
    return await this.friendRequestRepository
      .createQueryBuilder('fr')
      .select()
      .leftJoinAndSelect('fr.requestor', 'requestor')
      .where('fr.requestee = :userId', { userId: user.id })
      .getMany();
  }

  async getAllFriends(user: IGetUser) {
    return this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .where('uf.user1 = :userId OR uf.user2 = :userId', { userId: user.id })
      .getMany();
  }

  async getFriendsCount(user: IGetUser) {
    return this.userFriendsRepository.count({where: {user1: user.id}})
  }

  /**
   * Creates friends request from requestor to requestee.
   * @param requestor - user id that requests friendship.
   * @param requestee - user id to be requested friendship of.
   */
  async createFriendRequest(requestor: string, requestee: string) {
    if (requestee === requestor) {
      throw new ConflictException(ExceptionDictionary.friendRequest.cannotAddSelf);
    }

    const foundFriendship = await this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .where('(uf.user1 = :user1 AND uf.user2 = :user2) OR (uf.user1 = :user2 AND uf.user2 = :user1)', {
        user1: requestee,
        user2: requestor,
      })
      .getOne();

    if (foundFriendship) {
      throw new ConflictException(ExceptionDictionary.userFriends.alreadyFriends);
    }

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

    return await this.friendRequestRepository
      .create({
        requestor: requestor,
        requestee,
      })
      .save();
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
    const foundFriendRequest = await this.friendRequestRepository
      .createQueryBuilder('fr')
      .select()
      .where('fr.id = :friendRequestId AND fr.requestee = :userId', { friendRequestId, userId: user.id })
      .loadRelationIdAndMap('requestor', 'fr.requestor')
      .getOne();

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    await foundFriendRequest.remove();

    return {};
  }

  async acceptFriendRequest(user: IGetUser, friendRequestId: string) {
    const foundFriendRequest = await this.friendRequestRepository
      .createQueryBuilder('fr')
      .select()
      .where('fr.id = :friendRequestId AND fr.requestee = :userId', { friendRequestId, userId: user.id })
      .loadRelationIdAndMap('requestor', 'fr.requestor')
      .getOne();

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    const userFriends = await this.userFriendsRepository
      .create({ user1: user.id, user2: foundFriendRequest.requestor })
      .save();

    await foundFriendRequest.remove();

    return userFriends;
  }

  async removeFromFriends(user: IGetUser, friendId: string) {
    const foundFriendRequest = await this.userFriendsRepository
      .createQueryBuilder('fr')
      .select()
      .where('(fr.user1 = :userId AND fr.user2 = :friendId) OR (fr.user2 = :userId AND fr.user1 = :friendId)', {
        userId: user.id,
        friendId,
      })
      .getOne();

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    await foundFriendRequest.remove();

    return {};
  }
}
