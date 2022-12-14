import { Controller, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('auth')
  getHello(@Body() userData: object): string {
    return this.userService.login(userData);
  }
}
