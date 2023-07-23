import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMessage } from './groupMessage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly messageRepo: Repository<GroupMessage>,
  ) {}

  async groupMessage(groupMessage) {
    return this.messageRepo.save(groupMessage);
  }
}
