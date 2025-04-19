import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/constants/roles.enum';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload-interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @ApiOperation({ summary: 'Create a new group' })
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: 201, description: 'Group created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateGroupDto) {
        return this.groupsService.create(dto, user.userId);
    }

    @ApiOperation({ summary: 'Get all groups' })
    @ApiResponse({ status: 200, description: 'List of all groups.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get()
    findAll() {
        return this.groupsService.findAll();
    }

    @ApiOperation({ summary: 'Get group by ID' })
    @ApiParam({ name: 'id', type: String, description: 'Group ID' })
    @ApiResponse({ status: 200, description: 'Group details retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Group not found' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.groupsService.findOne(id);
    }
}