import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Group } from 'src/groups/groups.entity';
import { hashPassword } from 'src/shared/utils/hash.utils';
import { ApprovalStatus, UserRole } from 'src/shared/constants/roles.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateExpertDto } from './dto/create-expert.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) { }

  private async findGroupById(groupId: string | undefined): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async create(createUserDto: CreateStudentDto): Promise<User> {
    const { email, name, password, contactDetails, groupId } = createUserDto;

    console.log(createUserDto);
    let group: Group | undefined = undefined;
    if (groupId) {
      group = await this.findGroupById(groupId);
    }
    const hashedPassword = await hashPassword(password);
    try {
      const newUser = this.userRepository.create({
        email,
        name,
        password: hashedPassword,
        group,
        contactDetails
      });
      return this.userRepository.save(newUser);
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if (existingUser) {
        throw new ConflictException('Email is already taken');
      }
    }

    const updatedUser = Object.assign(user, updateUserDto);
    try {
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async saveRefreshToken(user: User, refreshToken: string): Promise<User> {
    user.refreshToken = refreshToken;
    return this.userRepository.save(user);
  }

  async createAdmin(createUserDto: CreateAdminDto): Promise<User> {
    const { email, name, password, contactDetails } = createUserDto;
    const hashedPassword = await hashPassword(password);
    const newAdmin = this.userRepository.create({
      email,
      name,
      contactDetails,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    return this.userRepository.save(newAdmin);
  }

  async registerExpert(createUserDto: CreateExpertDto): Promise<User> {
    const { email, name, password, groupId, skills, currentCompany, expertise, contactDetails } = createUserDto;
    const group = await this.findGroupById(groupId);
    const hashedPassword = await hashPassword(password);
    const newExpert = this.userRepository.create({
      email,
      name,
      contactDetails,
      password: hashedPassword,
      group,
      role: UserRole.EXPERT,
      approvalStatus: ApprovalStatus.PENDING,
      skills,
      currentCompany,
      expertise,
    });

    return this.userRepository.save(newExpert);
  }

  async approveExpert(id: string, status: Exclude<ApprovalStatus, ApprovalStatus.PENDING>): Promise<User> {
    const expert = await this.userRepository.findOne({ where: { id, role: UserRole.EXPERT } });
    if (!expert) {
      throw new NotFoundException('Expert not found');
    }
    expert.approvalStatus = status;
    return this.userRepository.save(expert);
  }

}