import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { AuthService } from "../services/auth.service";
import * as authUser from "../types/auth-user";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: import("../../users/entities/user.entity").User;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: import("../../users/entities/user.entity").User;
    }>;
    me(user: authUser.AuthUser): Promise<import("../../users/entities/user.entity").User>;
    changePassword(user: authUser.AuthUser, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
