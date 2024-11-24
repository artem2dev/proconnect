import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { ArticleService } from '../articles/article.service';
import { FriendsService } from '../friends/friends.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private friendsService: FriendsService,
    private articleService: ArticleService,
  ) {}

  async getUserById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .select()
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async getUserByUserName(userName: string) {
    return await this.userRepository.findOneBy({ userName });
  }

  async getUserProfileInfo(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    return user;
  }

  async toggleUserOnline(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user.isOnline) {
      return await this.userRepository.save({ id: userId, isOnline: false, wasOnline: new Date() });
    }

    return await this.userRepository.save({ id: userId, isOnline: true });
  }

  async getUserProfileInfoByUserName(userName: string) {
    const user = await this.userRepository.findOneBy({ userName });

    const friendsCount = await this.friendsService.getUserFriendsCount(user);

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    return { ...user, friendsCount };
  }

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.save(dto);

    return user;
  }

  async findAll(userId: string) {
    return await this.usersExtended(userId);
  }

  async usersExtended(userId: string) {
    const users = await this.userRepository.find();
    const userFriends = await this.friendsService.getAllFriends(userId);
    const userFriendIds = userFriends.map((uf) => uf.id);

    const usersExtended = await Promise.all(
      users.map(async (user) => {
        const friendsCount = await this.friendsService.getUserFriendsCount({ id: user.id });
        const articlesCount = await this.articleService.getUserArticlesCount(user.id);

        return { ...user, friendsCount, articlesCount, isFriend: userFriendIds.includes(user.id) };
      }),
    );

    return usersExtended;
  }

  async updateUser(userInfo: UpdateUserDto) {
    const { id } = userInfo;
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    const { userName, email } = user;

    if (userName !== userInfo.userName) {
      const isUserNameExists = await this.userRepository.findOneBy({
        userName: userInfo.userName,
      });

      if (isUserNameExists) {
        throw new HttpException('User with this user name already exists', HttpStatus.BAD_REQUEST);
      }
    }

    if (email !== userInfo.email) {
      const isEmailExists = await this.userRepository.findOneBy({
        email: userInfo.email,
      });

      if (isEmailExists) {
        throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
      }
    }

    return this.userRepository.update({ id }, userInfo);
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: string) {
    await this.userRepository.delete(id);
  }
}
