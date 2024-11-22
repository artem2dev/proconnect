import { Body, Controller, Delete, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserBody } from '../../common/decorators/user.decorator';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { IExtendedRequestWithUser } from '../../common/types/interfaces';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getUserProfile(@UserBody() user: User) {
    return await this.userService.getUserProfileInfo(user?.id);
  }

  @Get('profile/:userName')
  async getUserInfo(@Param('userName') userName: string) {
    return await this.userService.getUserProfileInfoByUserName(userName);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateUser(@Body() body: UpdateUserDto) {
    return this.userService.updateUser(body);
  }

  @Get('all')
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
