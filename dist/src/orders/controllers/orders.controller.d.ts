import * as authUser from "../../auth/types/auth-user";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { OrdersService } from "../services/orders.service";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: authUser.AuthUser, createOrderDto: CreateOrderDto): Promise<import("../entities/order.entity").Order>;
    findAll(user: authUser.AuthUser): Promise<import("../entities/order.entity").Order[]>;
    findOne(id: number, user: authUser.AuthUser): Promise<import("../entities/order.entity").Order>;
    update(id: number, user: authUser.AuthUser, updateOrderDto: UpdateOrderDto): Promise<import("../entities/order.entity").Order>;
    remove(id: number, user: authUser.AuthUser): Promise<void>;
}
