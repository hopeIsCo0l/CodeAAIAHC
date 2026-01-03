import { BadRequestException, Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard.js';
import { AuthGuard } from './auth.guard.js';
import { UsersService, publicUser, type UserRole } from './users.service.js';
import { type UpdateRoleDto } from './dtos.js';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard('admin'))
export class AdminController {
  constructor(private readonly users: UsersService) {}

  @Get('users')
  async listUsers() {
    const users = await this.users.list();
    return users.map(publicUser);
  }

  @Patch('users/:id/role')
  async updateRole(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    const role = body?.role as UserRole;
    if (role !== 'admin' && role !== 'user') {
      throw new BadRequestException('role must be admin or user');
    }
    const updated = await this.users.updateRole(id, role);
    return publicUser(updated);
  }
}
