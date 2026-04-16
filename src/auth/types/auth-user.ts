import { UserRole } from "../../users/entities/user.entity";

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
};
