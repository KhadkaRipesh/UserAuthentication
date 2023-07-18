import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.findUsers(username);
    console.log(user);
    console.log(user?.username);
    console.log(user?.password);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const tojwt = { id: user.id, username: user.username };
    return {
      token: await this.jwtService.signAsync(tojwt),
    };
  }
}
