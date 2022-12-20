import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtOpenGuard } from './user.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtOpenGuard)
  async getUser(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
