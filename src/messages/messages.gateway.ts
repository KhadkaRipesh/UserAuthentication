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

@WebSocketGateway()
export class MessagesGateway implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
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
    const from = client.data.username;
    const message = groupMessageDto.message;
    const newData = {
      from: from,
      message: message,
    };
    console.log(newData);

    client.broadcast.emit('group_message', { ...newData });
  }
}
