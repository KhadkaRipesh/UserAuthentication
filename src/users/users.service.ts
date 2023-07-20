import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BycryptService } from 'src/auth/bycrypt.service';
export type Users = any;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repoService: Repository<User>,

    private datasource: DataSource,
    private bycryptService: BycryptService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    // start transaction
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { username, password } = createUserDto;
      const hashedPassword = await this.bycryptService.hashPassword(password);
      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      await queryRunner.manager.save(user);
      // commit transaction
      await queryRunner.commitTransaction();
      console.log('Trans committed');
    } catch (e) {
      // rollback transaction
      await queryRunner.rollbackTransaction();
      console.log('Trans rollback due to', e);
    } finally {
      // release transaction
      await queryRunner.release();
    }
  }

  getUsers() {
    return this.repoService.find();
  }

  async findUser(username: string): Promise<Users | undefined> {
    return this.repoService.findOneBy({ username: username });
  }
}












// async createUser(createUserDto: CreateUserDto) {
//   const { username, password } = createUserDto;
//   const hashedPassword = await this.bycryptService.hashPassword(password);
//   const user = this.userService.create({
//     username,
//     password: hashedPassword,
//   });
//   return await this.userService.save(user);
// }

// async createUser(createUserDto: CreateUserDto) {
//   return await this.entityManager.transaction(
//     'SERIALIZABLE',
//     async (transactionalEntityManager) => {
//       try {
//         const { username, password } = createUserDto;
//         const hashedpw = await this.bycryptService.hashPassword(password);
//         const existingUser = await transactionalEntityManager.findOne(User, {
//           where: { username },
//         });
//         if (existingUser) {
//           throw new ConflictException('User exists.');
//         }
//         const user = this.repoService.create({
//           username,
//           password: hashedpw,
//         });
//         return await transactionalEntityManager.save(user);
//       } catch (e) {
//         throw e;
//       }
//     },
//   );
// }
