import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUpdateUserInfo } from 'src/common/types/user';
import { Repository } from 'typeorm';
import { FriendsService } from '../friends/friends.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private friendsService: FriendsService,
  ) {}

  getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  getUserById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async getUserInfo(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    return user;
  }

  async getUserInfoByUserName(userName: string) {
    const user = await this.userRepository.findOneBy({ userName });

    const userFriends = await this.friendsService.getAllFriends(user);
    console.log(1123, userFriends);
    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.save(dto);

    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  async updateUser(userInfo: IUpdateUserInfo) {
    const { id } = userInfo;
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    const { userName, email } = user;

    if (userName !== userInfo.userName) {
      const isUserNameExists = await this.userRepository.findOneBy({
        userName,
      });

      if (isUserNameExists) {
        throw new HttpException('User with this user name already exists', HttpStatus.BAD_REQUEST);
      }
    }

    if (email !== userInfo.email) {
      const isEmailExists = await this.userRepository.findOneBy({
        email,
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
