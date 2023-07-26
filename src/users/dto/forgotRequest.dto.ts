import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotRequestDto {
  @IsEmail()
  @ApiProperty({
    description: 'Enter the email you want to reset the password.',
    example: 'abc@gmail.com',
  })
  email: string;
}
