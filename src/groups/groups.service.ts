import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { User } from '../users/users.entity';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(dto: CreateGroupDto, createdById: string): Promise<Group> {
        const admin = await this.userRepository.findOne({ where: { id: createdById } });

        if (!admin) {
            throw new NotFoundException('Invalid admin ID');
        }
        if (admin.role !== 'admin') {
            throw new ForbiddenException('Only admins can create groups');
        }

        const group = this.groupRepository.create({
            name: dto.name,
            createdBy: { id: admin.id },
        });

        try {
            return this.groupRepository.save(group);
        } catch (error) {
            throw error;
        }

    }

    async findAll(): Promise<Group[]> {
        return this.groupRepository.find({
            relations: ['students', 'createdBy'],
        });
    }

    async findOne(id: string): Promise<Group> {
        const group = await this.groupRepository.findOne({
            where: { id },
            relations: ['students'],
        });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return group;
    }
}