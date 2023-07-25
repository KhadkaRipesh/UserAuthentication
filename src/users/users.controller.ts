import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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
  getUsers() {
    return this.userService.getUsers();
  }

  @Post('verify/:code')
  @ApiOperation({
    summary: 'Verify the user otp from the api.',
  })
  verifyAccount(@Param('code') code: string) {
    return this.userService.verifyAccount(+code);
  }

  @Put('/update/:id')
  @ApiOperation({
    summary: 'Update the user details from the api.',
  })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.userService.updateUser(+id, updateUserDto);
    return this.userService.findOne({ id: +id });
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Delete the user from the api.',
  })
  deleteUser(@Param('id') id: string) {
    this.userService.deleteUser(+id);
  }
}
