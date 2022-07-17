import { Injectable } from '@nestjs/common';
import { IUser } from '../api/users/entities/user.entity';
import { UsersService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interfaces/payload.auth';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.usersService.findOne({ where: { email } });

    if (user && bcrypt.compareSync(password, user.password) === true) {
      return user;
    }

    return null;
  }

  async login(user: IUser) {
    const payload: Payload = { email: user.email, sub: user.id };

    return {
      user,
      jwt: this.jwtService.sign(payload),
    };
  }
}
