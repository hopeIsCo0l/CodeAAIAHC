import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';
import { UsersService, publicUser } from './users.service.js';
import { type AuthDto } from './dtos.js';
// import { type User } from './users.service.js';
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Post('auth/register')
  async register(@Body() body: AuthDto, @Req() req: Request) {
    const { email, password } = body ?? {};
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.auth.register(email, password);
    req.session.userId = user.id;
    return user;
  }

  @Post('auth/login')
  async login(@Body() body: AuthDto, @Req() req: Request) {
    const { email, password } = body ?? {};
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.auth.validateUser(email, password);
    req.session.userId = user.id;
    return user;
  }

  @Post('auth/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: Request) {
    const userId = req.session.userId!;
    const user = await this.users.findById(userId);
    return publicUser(user!);
  }
}
