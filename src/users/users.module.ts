import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BycryptService } from 'src/auth/bycrypt.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <solverspro@gmail.com>',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, BycryptService],
  exports: [UsersService],
})
export class UsersModule {}
