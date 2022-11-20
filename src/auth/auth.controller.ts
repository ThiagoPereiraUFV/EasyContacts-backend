import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from '../api/users/users.service';
import {
  EmailExistsValidationPipe,
  JoiValidationPipe,
} from '../pipes/validations.pipe';
import { createUserSchema } from '../api/users/schemas/create-user.schema';
import { CreateUserDto } from '../api/users/dto/create-user.dto';
import { UpdateUserDto } from '../api/users/dto/update-user.dto';
import { updateMeSchema } from './schemas/update-me.schema';
import { IUser } from '../api/users/entities/user.entity';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: IUser) {
    return await this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body(new JoiValidationPipe(createUserSchema), EmailExistsValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create({
      data: createUserDto,
      include: { contacts: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateme')
  async updateme(
    @User() user: IUser,
    @Body(new JoiValidationPipe(updateMeSchema), EmailExistsValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update({
      where: { id: user.id },
      data: updateUserDto,
      include: { contacts: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@User() user: IUser) {
    return user;
  }
}
