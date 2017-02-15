export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isEnabled: boolean = true;
  password: string;
  plainPassword?: {first?: string, second?: string};
  avatarImageName: string;
  fullName: string;
}
