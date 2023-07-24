import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { GroupMessageDto } from './dto/group-msg.dto';
import { OnModuleInit } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrivateMessageDto } from './dto/private-msg.dto';

@WebSocketGateway()
export class MessagesGateway implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private messageService: MessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      try {
        const jwtToken = socket.handshake.headers.authorization;
        const data = await this.jwtService.verifyAsync(jwtToken.toString());
        if (!data) {
          return socket.disconnect();
        }
        const user = await this.userService.findOne({ id: data['id'] });
        const { password, ...result } = user;
        socket.data = { ...result };
        socket.broadcast.emit('new_user', { ...result });
        socket.join(data.id.toString());
      } catch (e) {
        console.log('goes to catch');
        return socket.disconnect();
      }
    });
  }

  @SubscribeMessage('group_message')
  async groupMessage(
    @MessageBody() groupMessageDto: GroupMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const from = client.data.id;
    const message = groupMessageDto.message;
    const newData = {
      ...groupMessageDto,
      fromUser: from,
      message: message,
    };
    await this.messageService.groupMessage({ ...newData });
    client.broadcast.emit('group_message', {
      ...newData,
    });
  }

  @SubscribeMessage('private_message')
  async privateMessage(
    @MessageBody() privateMessageDto: PrivateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const from = client.data.id;
    const to = privateMessageDto.to;
    const newData = { ...privateMessageDto, fromUser: from, toUser: to };
    client.join(to.toString());
    client.to(to.toString()).emit('private_message', { ...newData });

    await this.messageService.privateMessage({ ...newData });
  }
}
