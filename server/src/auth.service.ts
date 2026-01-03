import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UsersService, User, UserRole, publicUser } from './users.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const existing = await this.users.findByEmail(normalizedEmail);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const role: UserRole = (await this.users.count()) === 0 ? 'admin' : 'user';
    const user = await this.users.create(normalizedEmail, passwordHash, role);
    return publicUser(user) as User;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.users.findByEmail(normalizedEmail);
    if (!existing) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, existing.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return publicUser(existing) as User;
  }
}
