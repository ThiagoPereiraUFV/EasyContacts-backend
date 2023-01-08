import { UpdateUserDto } from '../../api/users/dto/update-user.dto';

export interface UpdateMeDto extends UpdateUserDto {
  oldPassword?: string;
}
