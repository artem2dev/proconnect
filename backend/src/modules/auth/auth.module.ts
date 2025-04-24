import { forwardRef, Module } from '@nestjs/common';
import { AccessTokenStrategy } from '../../common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../../common/strategies/refresh-token.strategy';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  imports: [forwardRef(() => UserModule)],
})
export class AuthModule {}
