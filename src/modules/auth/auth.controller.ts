import { Body, Controller, Get, Post, Req, Response, UseGuards } from '@nestjs/common';
import { Response as Res } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { IExtendedRequestWithUser } from 'src/common/types/interfaces';
import { config } from 'src/config/app.config';
import { getRefreshExpiresIn } from 'src/helpers/auth';
import { CreateUserDto } from 'src/modules/users/dto/create.user.dto';
import { LoginUserDto } from 'src/modules/users/dto/login.user.dto';
import { AuthService } from './auth.service';

const { DOMAIN, REFRESH_TOKEN_EXPIRES_DAYS_IN_MILLISECONDS } = config;

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

  @UseGuards(RefreshTokenGuard)
  @Get('sign-out')
  async signOut(@Response() res: Res) {
    res.clearCookie('refreshToken').send().end();
  }
}
