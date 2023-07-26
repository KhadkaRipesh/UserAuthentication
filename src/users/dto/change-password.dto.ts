import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Enter the old password',
    example: 'old password',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'Enter the new password',
    example: 'new password',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: 'Enter the confirmation password',
    example: 'new password',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
