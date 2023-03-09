import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTConfig } from 'src/configuration';
import Users from 'src/features/users/entities/user.entity';
import { UsersService } from 'src/features/users/users.service';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly jwt: JWTConfig, private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  async validate(payload: TokenPayload): Promise<Users | null> {
    return this.userService.findOne(payload.email);
  }
}
