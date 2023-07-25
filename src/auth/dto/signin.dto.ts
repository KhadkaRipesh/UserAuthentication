import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Enter the verified email here',
    example: 'karkibipul2@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter the valid password here',
    example: 'Bipul@123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}
