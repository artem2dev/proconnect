import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { config } from '../../config/app.config';

const { JWT_ACCESS_SECRET } = config;

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const [bearer, token] = req.headers.authorization?.split(' ') || [null, null];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }

      const user = this.jwtService.verify(token, {
        secret: JWT_ACCESS_SECRET,
      });

      req.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
