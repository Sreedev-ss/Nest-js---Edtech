import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Group } from 'src/groups/groups.entity';
import { GroupsModule } from 'src/groups/groups.module';
import { UsersController } from './users.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User, Group]),
  forwardRef(() => GroupsModule)],
  providers: [UsersService],
  controllers:[UsersController],
  exports: [UsersService],
})
export class UsersModule { }