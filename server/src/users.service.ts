import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async count(): Promise<number> {
    return this.users.length;
  }

  async create(email: string, passwordHash: string, role: UserRole): Promise<User> {
    const user: User = {
      id: uuid(),
      email,
      passwordHash,
      role,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async list(): Promise<User[]> {
    return [...this.users];
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    existing.role = role;
    return existing;
  }
}

export function publicUser(user: User) {
  const { passwordHash, ...rest } = user;
  return rest;
}
