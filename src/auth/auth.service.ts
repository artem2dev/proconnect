import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IGetUserInfo } from 'src/common/types/user';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { LoginUserDto } from 'src/users/dto/login.user.dto';
import { User } from 'src/users/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);

    return await this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return await this.generateToken(user);
  }

  private async generateToken(user: User | IGetUserInfo) {
    const payload = { email: user.email, id: user.id };

    const [accessToken, refreshToken] = (
      await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_ACCESS_SECRET || 'SECRET',
          expiresIn: '10s',
        }),
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET || 'SECRET',
          expiresIn: '7d',
        }),
      ])
    ).map((v) => 'Bearer ' + v);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user) {
      throw new HttpException('No such user', HttpStatus.BAD_REQUEST);
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Wrong email or password',
    });
  }

  async refreshTokens(userInfo: IGetUserInfo) {
    const tokens = await this.generateToken(userInfo);

    return tokens;
  }
}
