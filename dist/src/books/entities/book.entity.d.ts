import { Author } from '../../authors/entities/author.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Book {
    id: number;
    title: string;
    description: string;
    price: number;
    publishedYear: number;
    stock: number;
    createdAt: Date;
    author: Author;
    orders: Order[];
}
