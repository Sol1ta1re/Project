import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';
export declare enum OrderStatus {
    NEW = "new",
    PAID = "paid",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    status: OrderStatus;
    totalPrice: number;
    createdAt: Date;
    user: User;
    books: Book[];
}
