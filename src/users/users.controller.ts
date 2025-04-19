import { Controller, Post, Body, Put, Param, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { CreateExpertDto } from './dto/create-expert.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { UserRole } from 'src/shared/constants/roles.enum';
import { ApiBody, ApiOperation, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApproveExpertDto } from './dto/approve-expert.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload-interface';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateStudentDto } from './dto/create-student.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Create a new student' })
    @ApiBody({ type: CreateStudentDto })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post('create-student')
    create(@Body() createUserDto: CreateStudentDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Update User' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Put('update-user/:id')
    updateAnyUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.update(id, dto);
    }

    @ApiOperation({ summary: 'Update Student' })
    @ApiBody({ type: UpdateStudentDto })
    @ApiResponse({ status: 201, description: 'Student updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Admin not found' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STUDENT)
    @Put('update-student/:id')
    async updateStudent(
        @Param('id') id: string,
        @Body() dto: UpdateStudentDto,
        @CurrentUser() user: JwtPayload,
    ) {
        if (user.role === UserRole.STUDENT && user.userId !== id) {
            throw new ForbiddenException('Students can only update their own profile');
        }

        return this.usersService.update(id, dto);
    }

    @ApiOperation({ summary: 'Update Admin' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateAdminDto })
    @ApiResponse({ status: 200, description: 'Admin updated successfully.' })
    @ApiResponse({ status: 404, description: 'Admin not found' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Put('update-admin/:id')
    updateAdmin(
        @Param('id') id: string,
        @Body() dto: UpdateAdminDto,
    ) {
        return this.usersService.update(id, dto);
    }

    @ApiOperation({ summary: 'Update Expert' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateExpertDto })
    @ApiResponse({ status: 200, description: 'Expert updated successfully.' })
    @ApiResponse({ status: 404, description: 'Expert not found' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.EXPERT)
    @Put('update-expert/:id')
    updateExpert(
        @Param('id') id: string,
        @Body() dto: UpdateExpertDto,
        @CurrentUser() user: JwtPayload
    ) {
        if (user.role === UserRole.EXPERT && user.userId !== id) {
            throw new ForbiddenException('Experts can only update their own profile');
        }
        return this.usersService.update(id, dto);
    }


    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'User details retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of all users.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiOperation({ summary: 'Register a new expert' })
    @ApiBody({ type: CreateExpertDto })
    @ApiResponse({ status: 201, description: 'Expert registered successfully.' })
    @Post('register-expert')
    async registerExpert(@Body() createUserDto: CreateExpertDto) {
        return this.usersService.registerExpert(createUserDto);
    }

    @ApiOperation({ summary: 'Approve or reject an expert' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: ApproveExpertDto })
    @ApiResponse({ status: 200, description: 'Expert approval/rejection updated.' })
    @ApiResponse({ status: 404, description: 'Expert not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Post('approve-expert/:id')
    async approveExpert(@Param('id') id: string, @Body() dto: ApproveExpertDto) {
        return this.usersService.approveExpert(id, dto.status);
    }

    @ApiOperation({ summary: 'Create a new admin user' })
    @ApiBody({ type: CreateAdminDto })
    @ApiResponse({ status: 201, description: 'Admin created successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('create-admin')
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    createAdmin(@Body() body: CreateAdminDto) {
        return this.usersService.createAdmin(body);
    }
}