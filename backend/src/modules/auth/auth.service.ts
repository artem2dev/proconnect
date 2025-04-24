import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { IUserIdAndEmail } from '../../common/types/interfaces';
import { config } from '../../config/app.config';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../modules/users/dto/create.user.dto';
import { LoginUserDto } from '../../modules/users/dto/login.user.dto';
import { UserService } from '../users/user.service';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRES_HOURS, REFRESH_TOKEN_EXPIRES_DAYS } = config;

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);

    return await this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return await this.generateToken(user);
  }

  private async generateToken(user: User | IUserIdAndEmail) {
    const payload = { email: user.email, id: user.id };

    const [accessToken, refreshToken] = (
      await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: JWT_ACCESS_SECRET,
          expiresIn: ACCESS_TOKEN_EXPIRES_HOURS + 'h',
        }),
        this.jwtService.signAsync(payload, {
          secret: JWT_REFRESH_SECRET,
          expiresIn: REFRESH_TOKEN_EXPIRES_DAYS + 'd',
        }),
      ])
    ).map((token) => 'Bearer ' + token);

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

    const passwordEquals = await compare(userDto.password, user.password);

    if (passwordEquals) {
      return user;
    }

    throw new NotFoundException({
      message: 'Wrong email or password',
    });
  }

  async refreshTokens(userInfo: IUserIdAndEmail) {
    const tokens = await this.generateToken(userInfo);

    return tokens;
  }
}
