import { UserRole } from "../entities/user.entity";
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    age?: number;
    role?: UserRole;
}
