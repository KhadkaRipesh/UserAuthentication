import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { GroupMessageDto } from './dto/group-msg.dto';
import { MessagesGateway } from './messages.gateway';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageGateway: MessagesGateway) {}

  @Post('github')
  @HttpCode(200)
  handleGithubWebHook(@Body() paylod: any, @Req() req: Request) {
    console.log('Hello from webhook');
    const sender = paylod.sender?.login || 'GitHub';
    const event = req.headers['x-github-event'];
    const message = `Github event: ${event} occured from user: ${paylod.pusher.name} at: ${paylod.head_commit.timestamp} .`;
    const groupMessageDto: GroupMessageDto = { message };
    this.messageGateway.groupMessage(groupMessageDto, sender);
  }
}
