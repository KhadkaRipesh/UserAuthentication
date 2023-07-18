import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
export type Users = any;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return await this.userService.save(user);
  }
  getUsers() {
    return this.userService.find();
  }

  async findUsers(username: string): Promise<Users | undefined> {
    return this.userService.findOneBy({ username: username });
  }
}
