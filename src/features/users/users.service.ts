import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  public constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  public async markEmailAsConfirmed(email: string): Promise<void> {
    await this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
    return;
  }

  public async findOne(email: string): Promise<Users | null> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  public async getById(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new NotFoundException('User with that Id do not exist');
    }

    return user;
  }

  async create(userData: CreateUserDto): Promise<Users> {
    try {
      const newUser = await this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new HttpException('Unexpected error occured', HttpStatus.NOT_FOUND);
    }
  }
}
