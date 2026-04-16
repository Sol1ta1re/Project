import { CreateBookDto } from "../dto/create-book.dto";
import { UpdateBookDto } from "../dto/update-book.dto";
import { BooksService } from "../services/books.service";
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(createBookDto: CreateBookDto): Promise<import("../entities/book.entity").Book>;
    findAll(authorId?: string): Promise<import("../entities/book.entity").Book[]>;
    findOne(id: number): Promise<import("../entities/book.entity").Book>;
    update(id: number, updateBookDto: UpdateBookDto): Promise<import("../entities/book.entity").Book>;
    remove(id: number): Promise<void>;
}
