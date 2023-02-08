import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  author: { id: string };

  @IsNotEmpty()
  @IsString()
  recipient: { id: string };
}
