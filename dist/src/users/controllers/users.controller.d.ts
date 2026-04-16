import * as authUser from "../../auth/types/auth-user";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UsersService } from "../services/users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../entities/user.entity").User>;
    me(user: authUser.AuthUser): Promise<import("../entities/user.entity").User>;
    updateMe(user: authUser.AuthUser, updateProfileDto: UpdateProfileDto): Promise<import("../entities/user.entity").User>;
    findAll(): Promise<import("../entities/user.entity").User[]>;
    findUserOrders(id: number, user: authUser.AuthUser): Promise<import("../../orders/entities/order.entity").Order[]>;
    findOne(id: number): Promise<import("../entities/user.entity").User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("../entities/user.entity").User>;
    remove(id: number): Promise<void>;
}
