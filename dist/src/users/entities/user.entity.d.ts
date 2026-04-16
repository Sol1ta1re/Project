import { Order } from "../../orders/entities/order.entity";
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    password: string;
    age: number;
    createdAt: Date;
    orders: Order[];
}
