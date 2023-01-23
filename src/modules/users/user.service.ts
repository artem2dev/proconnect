import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendsService } from '../friends/friends.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private friendsService: FriendsService,
  ) {}

  async getUserById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async getUserByUserName(userName: string) {
    return await this.userRepository.findOneBy({ userName });
  }

  async getUserProfileInfo(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    return user;
  }

  async getUserProfileInfoByUserName(userName: string) {
    const user = await this.userRepository.findOneBy({ userName });

    const userFriendsCount = await this.friendsService.getUserFriendsCount(user);

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    return { ...user, userFriendsCount };
  }

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.save(dto);

    return user;
  }

  findAll() {
    return this.userRepository.find();
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
