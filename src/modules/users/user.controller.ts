import { Body, Controller, Delete, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IGetUserInfoRequest } from 'src/common/types/user';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserService } from './user.service';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserProfile(@Request() req: IGetUserInfoRequest) {
    return await this.userService.getUserProfileInfo(req.user?.id);
  }

  @Get('profile/:userName')
  async getUserInfo(@Param('userName') userName: string) {
    return await this.userService.getUserProfileInfoByUserName(userName);
  }

  @Put('profile')
  async updateUser(@Body() body: UpdateUserDto) {
    return this.userService.updateUser(body);
  }

  @Get('all')
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
