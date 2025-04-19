export enum UserRole {
    STUDENT = 'student',
    ADMIN = 'admin',
    EXPERT = 'expert',
    SUPER_ADMIN = 'super-admin',
  }

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  SUSPENDED = 'suspended',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}