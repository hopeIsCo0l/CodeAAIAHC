import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  mixin,
  type Type,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService, type UserRole } from './users.service.js';

export function RolesGuard(requiredRole: UserRole): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private readonly users: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const userId = request.session?.userId;
      if (!userId) {
        throw new UnauthorizedException('Authentication required');
      }
      const user = await this.users.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.role !== requiredRole) {
        throw new ForbiddenException('Insufficient role');
      }
      return true;
    }
  }

  return mixin(RoleGuardMixin);
}
