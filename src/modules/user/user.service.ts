import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<Omit<UserEntity, 'password'>[]> {
    const allUsers = await this.userRepository.find();
    const returnUsers = [];
    for (const user of allUsers) {
      returnUsers.push(this.sanitizeUserDto(user));
    }

    return returnUsers;
  }

  async get(id: string): Promise<Omit<UserEntity, 'password'>> {
    const returnUser = await this.userRepository.findOne({ where: { id } });

    if (!returnUser) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUserDto(returnUser);
  }

  async create(data: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    let returnUser = null;
    try {
      const newuser = this.userRepository.create({ ...data });
      returnUser = await this.userRepository.save(newuser);
    } catch (err) {
      throw new ConflictException('Login already taken');
    }

    return this.sanitizeUserDto(returnUser);
  }

  async delete(id: string): Promise<boolean> {
    const existedUser = await this.userRepository.findOne({ where: { id } });
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
    return true;
  }

  async updatePassword(
    id: string,
    data: UpdatePasswordDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    if (updatedUser.password !== data.oldPassword) {
      throw new ForbiddenException('Wrong password');
    }

    await this.userRepository.update(id, { password: data.newPassword });
    const returnUser = await this.userRepository.findOne({ where: { id } });

    return this.sanitizeUserDto(returnUser);
  }

  private sanitizeUserDto(user: UserEntity): Omit<UserEntity, 'password'> {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    sanitizedUser.createdAt =
      Date.parse(sanitizedUser.createdAt as unknown as string) / 1000;
    sanitizedUser.updatedAt =
      Date.parse(sanitizedUser.updatedAt as unknown as string) / 1000;
    return sanitizedUser;
  }
}
