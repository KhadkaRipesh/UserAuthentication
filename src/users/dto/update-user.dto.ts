import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Ripesh Khadka',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
