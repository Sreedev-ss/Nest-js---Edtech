import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UsersModule,
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: process.env.JWT_ACCESS_SECRET,
                    signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' },
                }
            },
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }