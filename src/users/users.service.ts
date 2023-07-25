import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BycryptService } from 'src/auth/bycrypt.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from './dto/update-user.dto';
export type Users = any;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repoService: Repository<User>,

    private datasource: DataSource,
    private bycryptService: BycryptService,
    private mailerService: MailerService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    // start transaction
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { username, email, password } = createUserDto;
      const hashedPassword = await this.bycryptService.hashPassword(password);
      const user = new User();
      user.username = username;
      user.email = email;
      user.password = hashedPassword;
      user.otp = Math.floor(Math.random() * 10000);
      const otpEx = 3;
      const otpExpiry = new Date(Date.now() + otpEx * 60000);
      user.expiryDate = otpExpiry;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify the otp',
        text: `Your otp is ${user.otp}`,
      });

      await queryRunner.manager.save(user);
      // commit transaction
      await queryRunner.commitTransaction();
      console.log('Trans committed');
      return user;
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

  async findOne(condition: any): Promise<Users> {
    return this.repoService.findOne({
      where: {
        ...condition,
      },
    });
  }

  async verifyAccount(code: number) {
    try {
      const user = await this.repoService.findOneBy({ otp: code });
      if (!user || user.expiryDate < new Date(Date.now())) {
        return new HttpException(
          'Verification code expired or not found',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        await this.repoService.update({ otp: user.otp }, { isVerified: true });
        return true;
      }
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.repoService.update(id, updateUserDto);
  }

  async deleteUser(id: number) {
    return this.repoService.delete(id);
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
