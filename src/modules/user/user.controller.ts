import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../../interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(): Promise<Omit<User, 'password'>[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.get(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(
    @Body() createUswerDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.create(createUswerDto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    const result = await this.userService.delete(id);
    return result;
  }
}
