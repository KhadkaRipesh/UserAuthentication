import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMessage } from './entities/groupMessage.entity';
import { Repository } from 'typeorm';
import { PrivateMessage } from './entities/privateMessage.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly messageRepo: Repository<GroupMessage>,
    @InjectRepository(PrivateMessage)
    private readonly privatemessage: Repository<PrivateMessage>,
  ) {}

  async groupMessage(groupMessage) {
    return this.messageRepo.save(groupMessage);
  }

  async privateMessage(privateMessage) {
    return this.privatemessage.save(privateMessage);
  }
}
