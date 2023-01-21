import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { updateMeSchema } from './schemas/update-me.schema';
import { IUser } from '../api/users/entities/user.entity';
import { User } from '../decorators/user.decorator';
import { UpdateMeDto } from './dto/update-me.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ description: 'Log me in' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  async login(@User() user: IUser) {
    return await this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ description: 'Sign me up' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
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
  @ApiOperation({ description: 'Update me' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async updateme(
    @User() user: IUser,
    @Body(new JoiValidationPipe(updateMeSchema), EmailExistsValidationPipe)
    updateUserDto: UpdateMeDto,
  ) {
    if (
      updateUserDto.oldPassword &&
      updateUserDto.password &&
      !(await this.authService.comparePassword(
        updateUserDto.oldPassword,
        user.password,
      ))
    ) {
      throw new BadRequestException('Password does not match');
    }

    delete updateUserDto.oldPassword;

    return await this.usersService.update({
      where: { id: user.id },
      data: updateUserDto,
      include: { contacts: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('removeme')
  @ApiOperation({ description: 'Remove me' })
  @ApiOkResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async removeme(@User() user: IUser) {
    return await this.usersService.remove({
      where: { id: user.id },
      include: { contacts: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ description: 'Get me' })
  @ApiOkResponse({
    description: 'The record has been successfully fetched.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async me(@User() user: IUser) {
    return user;
  }
}
