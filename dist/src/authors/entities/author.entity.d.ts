import { Book } from '../../books/entities/book.entity';
export declare class Author {
    id: number;
    name: string;
    country: string;
    birthYear: number;
    createdAt: Date;
    books: Book[];
}
