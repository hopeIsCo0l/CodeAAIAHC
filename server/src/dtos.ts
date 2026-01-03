export interface AuthDto {
  email: string;
  password: string;
}

export interface UpdateRoleDto {
  role: 'admin' | 'user';
}
