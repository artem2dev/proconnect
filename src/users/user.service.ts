import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { getError } from 'src/articles/errors/Errors';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);

    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);

      const newUser = {
        userName: user.userName,
        email: user.email,
        password: hash,
      };

      await this.userRepository.insert(newUser);

      return newUser;
    } catch (error) {
      return getError(error.code);
    }
  }

  async loginUser(email: string, password: string): Promise<Boolean> {
    const user = this.userRepository.findOneBy({ email, password });

    if (!user) return false;

    return true;
  }

  async login(user: User, jwt: JwtService) {
    try {
      const foundUser = await this.userRepository.findOneBy({
        email: user.email,
      });

      if (!foundUser) throw new Error('404');

      const { password } = foundUser;

      if (bcrypt.compare(user.password, password)) {
        throw new Error('10050');
      }

      const payload = { email: user.email };

      return {
        token: jwt.sign(payload),
      };
    } catch (error) {
      return getError(error.code);
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
