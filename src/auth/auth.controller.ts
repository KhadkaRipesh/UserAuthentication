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
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

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
  @ApiBearerAuth('Auth')
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

  @UseGuards(AuthGuard)
  @ApiBearerAuth('Auth')
  @Post('change-password')
  @ApiOperation({
    summary: 'Change your password from the api.',
  })
  @ApiOkResponse({
    description: 'Password changed Succesfully.',
  })
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.userService.changePassword(changePasswordDto, req.user);
  }
}
