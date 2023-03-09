import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/features/users/users.service';
import Users from 'src/features/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { RegisterDto } from './dto/register.dto';
import { TokenPayload } from './tokenPayload.interface';
import { JWTConfig } from 'src/configuration';
import { errorGuard } from 'src/utils/createGuard';
import { ValidateDto } from './dto/validate.dto';
import { WhoAmIResponse, WhoAmIResult } from './auth.pb';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: JWTConfig,
  ) {}

  public async validateUser(email: string, pass: string): Promise<Users> {
    try {
      const user = await this.userService.findOne(email);
      await this.verifyPassword(pass, user.password);
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtToken(userPayload: TokenPayload): string {
    const token = this.jwtService.sign(userPayload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.expirationTime}`;
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);

    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  public async register(registrationData: RegisterDto): Promise<Users> {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const createdUser = await this.userService.create({
      ...registrationData,
      password: hashedPassword,
    });
    return createdUser;
  }

  public getCookieForLogOut(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async verify(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Wrong Token');
    }
  }

  public async login({ email, password }: LoginDto): Promise<WhoAmIResult> {
    const user: Users = await this.userService.findOne(email);

    if (!user) {
      throw new NotFoundException('User with that email not exist');
    }

    await this.verifyPassword(password, user.password);

    return user;
  }

  public async validate({ token }: ValidateDto): Promise<WhoAmIResponse> {
    const decoded: TokenPayload = await this.verify(token);

    if (!decoded) {
      throw new UnauthorizedException('Wrong Token');
    }

    const auth: Users = await this.userService.findOne(decoded.email);

    if (!auth) {
      throw new UnauthorizedException('User not exist');
    }

    return {
      data: {
        ...auth,
      },
    };
  }
}
