import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { IGetUserInfoRequest } from 'src/common/types/user';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { LoginUserDto } from 'src/users/dto/login.user.dto';
import { AuthService } from './auth.service';

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export const REFRESH_TOKEN_EXPIRES_DAYS_IN_SECONDS =
  REFRESH_TOKEN_EXPIRES_DAYS * 86400000; // 24 * 60 * 60

function getExpiresIn() {
  const expiresIn = new Date();
  expiresIn.setTime(+expiresIn + REFRESH_TOKEN_EXPIRES_DAYS_IN_SECONDS);

  return expiresIn;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() userDto: LoginUserDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(userDto);

    res
      .cookie('refreshToken', refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRES_DAYS_IN_SECONDS,
        expires: getExpiresIn(),
        sameSite: 'none',
        domain: 'localhost' || '',
      })
      .send(accessToken)
      .end();
  }

  @Post('registration')
  async registration(
    @Body() userDto: CreateUserDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    const { accessToken, refreshToken } = await this.authService.registration(
      userDto,
    );
    res.cookie('refreshToken', refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    return accessToken;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: IGetUserInfoRequest, @Response() res: Res) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.user,
    );
    
    res
      .cookie('refreshToken', refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRES_DAYS_IN_SECONDS,
        expires: getExpiresIn(),
        sameSite: 'none',
        domain: 'localhost' || '',
      })
      .send(accessToken)
      .end();
  }
}
