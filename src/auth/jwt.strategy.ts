import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwt } from './jwt';
import { UsersService } from '../api/users/users.service';
import { Payload } from './interfaces/payload.auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  async validate(payload: Payload) {
    const { sub: id } = payload;

    return await this.usersService.findOne({
      where: { id },
      include: { contacts: true },
    });
  }
}
