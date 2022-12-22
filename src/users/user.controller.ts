import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserService } from './user.service';

export interface IGetUserInfoRequest extends Request {
  user: { id: string; email: string };
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getUser(@Request() req: IGetUserInfoRequest) {
    return await this.userService.findOne(req.user?.id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
