import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from '../jwt.constants';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/users.service'; //imported userService to validate user based informations later like: check if the user still exists, check roles/permissions, verify account status (banned, deleted, etc.)

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, configService: ConfigService) { 
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
    }); 
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    console.log(user)
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}