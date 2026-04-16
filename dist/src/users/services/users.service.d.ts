import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { Order } from "../../orders/entities/order.entity";
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    getProfile(id: number): Promise<User>;
    updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User>;
    findOrdersByUserId(userId: number): Promise<Order[]>;
    remove(id: number): Promise<void>;
    private ensureEmailIsUnique;
    private validateAge;
}
