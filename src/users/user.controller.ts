import { Controller, Get, Body, Post, Param, Delete } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @Post('login')
  async loginUser(@Body() userData: LoginUserDto) {
    return await this.userService.loginUser(userData.email, userData.password);
  }

  @Get('all')
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
