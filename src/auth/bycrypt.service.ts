import { Injectable } from '@nestjs/common';
import * as bycrypt from 'bcrypt';
@Injectable()
export class BycryptService {
  async hashPassword(password: string): Promise<string> {
    const rounding = 10;
    const hashPassword = await bycrypt.hash(password, rounding);
    return hashPassword;
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatched = await bycrypt.compare(password, hashPassword);
    return isMatched;
  }
}
