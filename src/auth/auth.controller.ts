import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return await this.authService.login(req.user);
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
    @Req() req: Request,
    @Body(new JoiValidationPipe(updateMeSchema), EmailExistsValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update({
      where: { id: req.user.id },
      data: updateUserDto,
      include: { contacts: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return req.user;
  }
}
