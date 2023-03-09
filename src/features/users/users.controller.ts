import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from '@nestjs/common';
import RequestWithUser from 'src/auth/requestWithUser';
import Users from './entities/user.entity';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
