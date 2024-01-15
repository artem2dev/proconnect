import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ReadChatDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsArray()
  messages: string[];

  @IsNotEmpty()
  @IsString()
  userId: string;
}
