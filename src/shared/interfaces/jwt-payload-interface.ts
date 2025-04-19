export interface JwtPayload {
    userId: string;
    email: string;
    role: 'student' | 'admin' | 'expert' | 'super-admin';
  }