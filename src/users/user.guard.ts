import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Observable } from 'rxjs';

@Injectable()
export class JwtOpenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const [bearer, token] = req.headers.authorization?.split(' ') || [
        null,
        null,
      ];

      if (!(bearer && token)) {
        return true;
      }

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }

      const user = this.jwtService.verify(token);
      req.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
