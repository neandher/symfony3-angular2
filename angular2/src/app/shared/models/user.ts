export class User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarImageName: string;
  avatarImageUrl: string;
  isEnabled: boolean = true;
  lastLoginAt: string;
  isLocked: boolean;
  isExpired: boolean;
  expiresAt: string;
  passwordRequestedAt: string;
  isCredentialsExpired: boolean;
  credentialsExpireAt: string;
  createdAt: string;
  password: string;
  plainPassword?: {first?: string, second?: string};
}
