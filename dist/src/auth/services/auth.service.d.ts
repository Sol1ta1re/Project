import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    getMe(userId: number): Promise<User>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private buildAuthResponse;
}
