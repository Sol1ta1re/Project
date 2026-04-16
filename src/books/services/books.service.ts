// src/books/books.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { Author } from '../../authors/entities/author.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    if (!createBookDto.title) {
      throw new BadRequestException('Book title is required');
    }
    if (createBookDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (createBookDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    const author = await this.authorRepository.findOne({
      where: { id: createBookDto.authorId },
    });
    if (!author) {
      throw new NotFoundException(
        `Author with id ${createBookDto.authorId} not found`,
      );
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      author,
    });
    return this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    if (updateBookDto.price !== undefined && updateBookDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (updateBookDto.stock !== undefined && updateBookDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    if (updateBookDto.authorId) {
      const author = await this.authorRepository.findOne({
        where: { id: updateBookDto.authorId },
      });
      if (!author) {
        throw new NotFoundException(
          `Author with id ${updateBookDto.authorId} not found`,
        );
      }
      book.author = author;
      delete updateBookDto.authorId;
    }

    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  // Доп. метод: фильтрация по автору (для звёздочки)
  async findByAuthor(authorId: number): Promise<Book[]> {
    return this.bookRepository.find({
      where: { author: { id: authorId } },
      relations: ['author'],
    });
  }

  // Доп. метод: пагинация и сортировка по цене
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<[Book[], number]> {
    return this.bookRepository.findAndCount({
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: { price: 'ASC' },
    });
  }
}
