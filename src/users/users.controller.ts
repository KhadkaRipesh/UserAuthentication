import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotRequestDto } from './dto/forgotRequest.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a user from the api.',
  })
  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'User cannot registered.',
  })
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('fetch')
  @ApiOperation({
    summary: 'Get all data from the api.',
  })
  @ApiOkResponse({
    description: 'User data fetched Successfully.',
  })
  getUsers() {
    return this.userService.getUsers();
  }

  @Post('verify/:code')
  @ApiOperation({
    summary: 'Verify the user otp from the api.',
  })
  @ApiCreatedResponse({
    description: 'User Account verified Succesfully',
  })
  @ApiUnauthorizedResponse({
    description: 'OTP has been expired',
  })
  verifyAccount(@Param('code') code: string) {
    return this.userService.verifyAccount(+code);
  }

  @Put('/update/:id')
  @ApiOperation({
    summary: 'Update the user details from the api.',
  })
  @ApiOkResponse({
    description: 'Updated Successfully',
  })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.userService.updateUser(+id, updateUserDto);
    return this.userService.findOne({ id: +id });
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Delete the user from the api.',
  })
  @ApiOkResponse({
    description: 'The user has been deleted succesully.',
  })
  deleteUser(@Param('id') id: string) {
    this.userService.deleteUser(+id);
  }

  @Post('/forgotRequest')
  @ApiOperation({
    summary: 'Get the otp to recover the password.',
  })
  @ApiCreatedResponse({
    description: 'OTP has been succesfully sent to the email.',
  })
  @ApiNotFoundResponse({
    description: 'The email is invalid.',
  })
  forgotPassword(@Body() forgotRequestDto: ForgotRequestDto) {
    return this.userService.resetPasswordReq(forgotRequestDto);
  }

  @Patch('/reset-password')
  @ApiOperation({
    summary: 'Reset the password from the api.',
  })
  @ApiOkResponse({
    description: 'The password has been reset successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid OTP or Password not matched.',
  })
  resetPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.resetPassword(forgotPasswordDto);
  }
}
