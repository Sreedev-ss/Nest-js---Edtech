import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/shared/utils/hash.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  private validateLoginEligibility(user: User): void {
    if (user.role === 'expert' && user.approvalStatus !== 'approved') {
      throw new UnauthorizedException('Expert approval required.');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Your account is currently disabled.');
    }
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.validateLoginEligibility(user);

    const { accessToken, refreshToken } = this.generateTokens(user);

    await this.usersService.saveRefreshToken(user, refreshToken); //TODO: Set on cookie on production
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken, refreshToken:newRefreshToken } = this.generateTokens(user);
      await this.usersService.saveRefreshToken(user, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

}