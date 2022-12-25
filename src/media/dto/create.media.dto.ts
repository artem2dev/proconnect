import { IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  originalName: string;
  @IsString()
  userId: string;
}
