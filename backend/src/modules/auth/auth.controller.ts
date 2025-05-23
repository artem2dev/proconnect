import { Body, Controller, Get, Post, Req, Response, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { RefreshTokenGuard } from '../../common/guards/refreshToken.guard';
import { IExtendedRequestWithUser } from '../../common/types/interfaces';
import { config } from '../../config/app.config';
import { getRefreshExpiresIn } from '../../helpers/auth';
import { CreateUserDto } from '../../modules/users/dto/create.user.dto';
import { LoginUserDto } from '../../modules/users/dto/login.user.dto';
import { AuthService } from './auth.service';

const { DOMAIN, REFRESH_TOKEN_EXPIRES_DAYS_IN_MILLISECONDS } = config;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: LoginUserDto, @Response({ passthrough: true }) res: Res) {
    const { accessToken, refreshToken } = await this.authService.login(userDto);

    res
      .cookie('refreshToken', refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRES_DAYS_IN_MILLISECONDS,
        expires: getRefreshExpiresIn(),
        sameSite: 'none',
        domain: DOMAIN,
      })
      .send(accessToken)
      .end();
  }

  @Post('registration')
  async registration(@Body() userDto: CreateUserDto, @Response({ passthrough: true }) res: Res) {
    const { accessToken, refreshToken } = await this.authService.registration(userDto);
    res
      .cookie('refreshToken', refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRES_DAYS_IN_MILLISECONDS,
        expires: getRefreshExpiresIn(),
        sameSite: 'none',
        domain: DOMAIN,
      })
      .send(accessToken)
      .end();
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: IExtendedRequestWithUser, @Response() res: Res) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(req.user);

    res
      .cookie('refreshToken', refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRES_DAYS_IN_MILLISECONDS,
        expires: getRefreshExpiresIn(),
        sameSite: 'none',
        domain: DOMAIN,
      })
      .send(accessToken)
      .end();
  }

  // @UseGuards(RefreshTokenGuard)
  @Get('sign-out')
  async signOut(@Response() res: Res) {
    res.clearCookie('refreshToken').send().end();
  }
}
