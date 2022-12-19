import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from 'nestjs-minio-client';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private minIO: MinioService,
  ) {}

  getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.save(dto);
    // await this.minIO.client.putObject('media', file.originalname, file.stream);
    return user;
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
