import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionDictionary } from 'src/common/dictionary/ExceptionDictionary';
import { IGetUser } from 'src/common/types/user';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { FriendRequest } from './friend-requests.entity';
import { UserFriends } from './user-friends.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(UserFriends)
    private userFriendsRepository: Repository<UserFriends>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getAllFriendRequests(user: IGetUser) {
    console.log(11123123123, user)
    return await this.friendRequestRepository
      .createQueryBuilder('fr')
      .select()
      .leftJoinAndSelect('fr.requestor', 'requestor')
      .where('fr.requestee = :userId', { userId: user.id })
      .getMany();
  }

  async getAllFriends(userName: string) {
    const user = await this.userRepository.findOneBy({ userName });

    if (!user) {
      throw new ConflictException(ExceptionDictionary.user.noSuchUser);
    }

    const friends = await this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .leftJoinAndSelect('uf.user1', 'user1')
      .leftJoinAndSelect('uf.user2', 'user2')
      .where('uf.user1 = :userId OR uf.user2 = :userId', { userId: user.id })
      .getMany();

    const filteredFriends = friends.map((friend) =>
      friend.user1.userName === userName ? { ...friend.user2 } : { ...friend.user1 },
    );

    return filteredFriends;
  }

  async getUserFriendsCount(user: IGetUser) {
    return this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .where('uf.user1 = :userId OR uf.user2 = :userId', { userId: user.id })
      .getCount();
  }

  async createFriendRequest(requestor: IGetUser, requestee: IGetUser) {
    if (requestee.id === requestor.id) {
      throw new ConflictException(ExceptionDictionary.friendRequest.cannotAddSelf);
    }
    console.log(requestee, requestor);
    const foundFriendship = await this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .where('(uf.user1 = :user1 AND uf.user2 = :user2) OR (uf.user1 = :user2 AND uf.user2 = :user1)', {
        user1: requestee.id,
        user2: requestor.id,
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
        { requestor: requestor.id, requestee: requestee.id },
      )
      .getOne();

    if (foundFriendRequest) {
      throw new ConflictException(ExceptionDictionary.friendRequest.alreadyExists);
    }

    return await this.friendRequestRepository
      .create({
        requestor,
        requestee,
      })
      .save();
  }

  async deleteFriendRequest(user: IGetUser, friendRequestId: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({
      where: { id: friendRequestId, requestor: user },
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
      .create({ user1: user, user2: foundFriendRequest.requestor })
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
