import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionDictionary } from '../../common/dictionary/ExceptionDictionary';
import { I_Id } from '../../common/types/interfaces';
import { FriendRequest } from '../../entities/friend-requests.entity';
import { UserFriends } from '../../entities/user-friends.entity';
import { User } from '../../entities/user.entity';

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
  async getAllFriendRequests(user: I_Id) {
    return await this.friendRequestRepository
      .createQueryBuilder('fr')
      .select()
      .leftJoinAndSelect('fr.requestor', 'requestor')
      .where('fr.requestee = :userId', { userId: user.id })
      .getMany();
  }

  async getAllFriends(userId: string) {
    const friends = await this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .leftJoinAndSelect('uf.user1', 'user1')
      .leftJoinAndSelect('uf.user2', 'user2')
      .where('uf.user1 = :userId OR uf.user2 = :userId', { userId })
      .getMany();

    const filteredFriends = friends.map((friend) =>
      friend.user1.id === userId ? { ...friend.user2 } : { ...friend.user1 },
    );

    return filteredFriends;
  }

  async getAllFriendsByUserName(userName: string) {
    const user = await this.userRepository.findOneBy({ userName });

    if (!user) {
      throw new ConflictException(ExceptionDictionary.user.noSuchUser);
    }

    const userFriends = await this.getAllFriends(user.id);

    return userFriends;
  }

  async getUserFriendsCount(user: I_Id) {
    return this.userFriendsRepository
      .createQueryBuilder('uf')
      .select()
      .where('uf.user1 = :userId OR uf.user2 = :userId', { userId: user.id })
      .getCount();
  }

  async createFriendRequest(requestor: I_Id, requestee: I_Id) {
    if (requestee.id === requestor.id) {
      throw new ConflictException(ExceptionDictionary.friendRequest.cannotAddSelf);
    }

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

  async deleteFriendRequest(user: I_Id, friendRequestId: string) {
    const foundFriendRequest = await this.friendRequestRepository.findOne({
      where: { id: friendRequestId, requestor: user },
    });

    if (!foundFriendRequest) {
      throw new NotFoundException(ExceptionDictionary.friendRequest.notFound);
    }

    await foundFriendRequest.remove();

    return {};
  }

  async declineFriendRequest(user: I_Id, friendRequestId: string) {
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

  async acceptFriendRequest(user: I_Id, friendRequestId: string) {
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

  async removeFromFriends(user: I_Id, friendId: string) {
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
