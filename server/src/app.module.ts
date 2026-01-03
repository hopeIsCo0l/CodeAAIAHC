import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AdminController } from './admin.controller.js';
import { UsersService } from './users.service.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [],
  controllers: [AuthController, AdminController],
  providers: [UsersService, AuthService],
})
export class AppModule {}
