import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsStrongPassword } from 'class-validator';

export class ForgotPasswordDto {
  @IsNumber()
  @ApiProperty({
    description: 'Enter the OTP here.',
    example: 'XXXX',
  })
  otp: number;

  @IsStrongPassword()
  @ApiProperty({
    description: 'Enter the New Password.',
    example: 'New Password',
  })
  newPassword: string;

  @IsStrongPassword()
  @ApiProperty({
    description: 'Enter the same password again.',
    example: 'New Password',
  })
  confirmPassword: string;
}
