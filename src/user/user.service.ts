import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  login(userData): string {
    return 'You logged in as ' + userData.name;
  }
}
