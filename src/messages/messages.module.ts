import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './entities/groupMessage.entity';
import { UsersModule } from 'src/users/users.module';
import { PrivateMessage } from './entities/privateMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMessage, PrivateMessage]),
    UsersModule,
  ],
  providers: [MessagesService, MessagesGateway],
  controllers: [MessagesController],
})
export class MessagesModule {}
