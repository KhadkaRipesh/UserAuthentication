import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { BycryptService } from './bycrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private bycryptService: BycryptService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(username);
    if(!user){
      throw new BadRequestException();
    }
    const toCompare = await this.bycryptService.comparePassword(
      password,
      user?.password,
    );
    if (!toCompare) {
      throw new UnauthorizedException();
    }
    const tojwt = { id: user.id, username: user.username };
    return {
      token: await this.jwtService.signAsync(tojwt),
    };
  }
}
