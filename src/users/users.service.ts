import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BycryptService } from 'src/auth/bycrypt.service';
export type Users = any;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,

    @InjectEntityManager() private readonly entityManager: EntityManager,
    private bycryptService: BycryptService,
  ) {}
  // async createUser(createUserDto: CreateUserDto) {
  //   const { username, password } = createUserDto;
  //   const hashedPassword = await this.bycryptService.hashPassword(password);
  //   const user = this.userService.create({
  //     username,
  //     password: hashedPassword,
  //   });
  //   return await this.userService.save(user);
  // }

  getUsers() {
    return this.userService.find();
  }

  async findUser(username: string): Promise<Users | undefined> {
    return this.userService.findOneBy({ username: username });
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.entityManager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManages) => {
        try {
          const { username, password } = createUserDto;
          const haspw = await this.bycryptService.hashPassword(password);
          const user = this.userService.create({ username, password: haspw });
          return await transactionalEntityManages.save(user);
        } catch (e) {
          throw e;
        }
      },
    );
  }
}

// async createUser(createUserDto: CreateUserDto) {
//   return await this.entityManager.transaction(async (transactionalEntityManager) => {
//     const { username, password } = createUserDto;
//     const hashedPassword = await this.bcryptService.hashPassword(password);
//     const user = this.userService.create({
//       username,
//       password: hashedPassword,
//     });
//     return await transactionalEntityManager.save(user);
//   });
// }
