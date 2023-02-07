import { IsNotEmpty, IsString } from 'class-validator';

export class ReadChatDto {
  @IsNotEmpty()
  @IsString()
  singleChatId: string;

  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
