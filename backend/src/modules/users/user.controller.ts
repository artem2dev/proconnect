import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IExtendedRequestWithUser } from 'src/common/types/interfaces';
import { UserBody } from '../../common/decorators/user.decorator';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('profile')
  async getUserProfile(@UserBody() user: User) {
    return await this.userService.getUserProfileInfo(user?.id);
  }

  @Get('profile/:userName')
  async getUserInfo(@Param('userName') userName: string) {
    return await this.userService.getUserProfileInfoByUserName(userName);
  }

  @ApiBearerAuth()
  @Put('profile')
  async updateUser(@Body() body: UpdateUserDto) {
    return this.userService.updateUser(body);
  }

  @Get('all')
  async getAllUsers(@Req() req: IExtendedRequestWithUser) {
    return await this.userService.findAll(req.user.id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
