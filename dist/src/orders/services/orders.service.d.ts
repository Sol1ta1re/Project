import { Repository } from "typeorm";
import { AuthUser } from "../../auth/types/auth-user";
import { Book } from "../../books/entities/book.entity";
import { User } from "../../users/entities/user.entity";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { Order } from "../entities/order.entity";
export declare class OrdersService {
    private orderRepository;
    private userRepository;
    private bookRepository;
    constructor(orderRepository: Repository<Order>, userRepository: Repository<User>, bookRepository: Repository<Book>);
    create(currentUser: AuthUser, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(currentUser: AuthUser): Promise<Order[]>;
    findOne(id: number, currentUser: AuthUser): Promise<Order>;
    update(id: number, currentUser: AuthUser, updateOrderDto: UpdateOrderDto): Promise<Order>;
    remove(id: number, currentUser: AuthUser): Promise<void>;
    private ensureOrderAccess;
}
