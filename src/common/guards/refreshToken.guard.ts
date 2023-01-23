import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { config } from 'src/config/app.config';

const { JWT_REFRESH_SECRET } = config;

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const [bearer, token] = req.cookies.refreshToken?.split(' ') || [null, null];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }

      const decoded = this.jwtService.verify(token, {
        secret: JWT_REFRESH_SECRET,
      });

      req.user = { ...decoded, refreshToken: token };

      return true;
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
