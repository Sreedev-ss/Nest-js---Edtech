import { forwardRef, Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './groups.entity';
import { User } from '../users/users.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Group, User]),
    forwardRef(() => UsersModule)],
    providers: [GroupsService],
    controllers: [GroupsController],
    exports: [GroupsService],
})
export class GroupsModule {}