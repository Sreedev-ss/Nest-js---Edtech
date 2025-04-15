import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, password: hashed });
    return this.usersRepo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: jwtConstants.accessExpire,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpire,
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.refreshSecret,
      });

      const user = await this.usersRepo.findOne({ where: { id: decoded.sub } });
      if (!user) throw new UnauthorizedException();

      const payload = { sub: user.id, email: user.email, role: user.role };

      return {
        accessToken: this.jwtService.sign(payload, {
          secret: jwtConstants.accessSecret,
          expiresIn: jwtConstants.accessExpire,
        }),
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}