import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AppService } from './app.service';
import { UsersService } from '../api/users/users.service';
import {
  EmailExistsValidationPipe,
  JoiValidationPipe,
} from '../pipes/validations.pipe';
import { createUserSchema } from '../api/users/schemas/create-user.schema';
import { CreateUserDto } from '../api/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/api/users/dto/update-user.dto';
import { updateUserSchema } from 'src/api/users/schemas/update-user.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  index(@Res() res: Response) {
    return res.json({ message: this.appService.getRunningMessage() });
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request) {
    return await this.authService.login(req.user);
  }

  @Post('auth/register')
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
  @Patch('auth/updateme')
  async updateme(
    @Req() req: Request,
    @Body(new JoiValidationPipe(updateUserSchema), EmailExistsValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update({
      where: { id: req.user.id },
      data: updateUserDto,
      include: { contacts: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async me(@Req() req: Request) {
    return req.user;
  }
}
