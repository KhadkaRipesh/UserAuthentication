import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Enter the valid credintial to get logged in.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login Succesfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Enter the valid credential',
  })
  login(@Body() siginDto: SignInDto): Record<string, any> {
    return this.authService.signIn(siginDto.email, siginDto.password);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @Get('profile')
  @ApiOperation({
    summary: 'Enter the credential to access your profile.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized or invalid token',
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
