import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ email: email });
    console.log(email);
    console.log(user);
    if (!user) {
      throw new BadRequestException();
    } else {
      if (user.isVerified) {
        const toCompare = await this.bycryptService.comparePassword(
          password,
          user?.password,
        );
        if (!toCompare) {
          throw new UnauthorizedException();
        }
        const tojwt = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        return {
          token: await this.jwtService.signAsync(tojwt),
        };
      } else {
        return new HttpException(
          'Please verify your account',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
