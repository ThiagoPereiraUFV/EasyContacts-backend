import { Injectable } from '@nestjs/common';
import { User } from 'src/api/users/entities/user.entity';
import { UsersService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({ where: { email } });

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };

    return {
      user,
      jwt: this.jwtService.sign(payload),
    };
  }
}
