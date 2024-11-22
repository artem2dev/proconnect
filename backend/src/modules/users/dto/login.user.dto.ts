import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'admin@admin.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'adminadmin' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
