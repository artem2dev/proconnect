import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  id: string;
  @IsString()
  userName: string;
  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  description: string;
}
