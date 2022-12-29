import { Body, Controller, Delete, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IGetUserInfoRequest, IUpdateUserInfo } from 'src/common/types/user';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getUser(@Request() req: IGetUserInfoRequest) {
    return await this.userService.getUserInfo(req.user?.id);
  }

  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateUser(@Body() body: IUpdateUserInfo) {
    return this.userService.updateUser(body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('all')
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
