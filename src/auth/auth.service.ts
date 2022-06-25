import { Injectable } from '@nestjs/common';
import { User } from 'src/api/users/entities/user.entity';
import { UsersService } from '../api/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({ where: { email } });

    if (user && user.password === password) {
      return user;
    }

    return null;
  }
}
