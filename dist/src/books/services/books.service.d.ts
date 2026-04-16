import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { Author } from '../../authors/entities/author.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
export declare class BooksService {
    private bookRepository;
    private authorRepository;
    constructor(bookRepository: Repository<Book>, authorRepository: Repository<Author>);
    create(createBookDto: CreateBookDto): Promise<Book>;
    findAll(): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    update(id: number, updateBookDto: UpdateBookDto): Promise<Book>;
    remove(id: number): Promise<void>;
    findByAuthor(authorId: number): Promise<Book[]>;
    findAllPaginated(page?: number, limit?: number): Promise<[Book[], number]>;
}
