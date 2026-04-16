"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("../entities/book.entity");
const author_entity_1 = require("../../authors/entities/author.entity");
let BooksService = class BooksService {
    bookRepository;
    authorRepository;
    constructor(bookRepository, authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }
    async create(createBookDto) {
        if (!createBookDto.title) {
            throw new common_1.BadRequestException('Book title is required');
        }
        if (createBookDto.price < 0) {
            throw new common_1.BadRequestException('Price cannot be negative');
        }
        if (createBookDto.stock < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative');
        }
        const author = await this.authorRepository.findOne({
            where: { id: createBookDto.authorId },
        });
        if (!author) {
            throw new common_1.NotFoundException(`Author with id ${createBookDto.authorId} not found`);
        }
        const book = this.bookRepository.create({
            ...createBookDto,
            author,
        });
        return this.bookRepository.save(book);
    }
    async findAll() {
        return this.bookRepository.find({ relations: ['author'] });
    }
    async findOne(id) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }
    async update(id, updateBookDto) {
        const book = await this.findOne(id);
        if (updateBookDto.price !== undefined && updateBookDto.price < 0) {
            throw new common_1.BadRequestException('Price cannot be negative');
        }
        if (updateBookDto.stock !== undefined && updateBookDto.stock < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative');
        }
        if (updateBookDto.authorId) {
            const author = await this.authorRepository.findOne({
                where: { id: updateBookDto.authorId },
            });
            if (!author) {
                throw new common_1.NotFoundException(`Author with id ${updateBookDto.authorId} not found`);
            }
            book.author = author;
            delete updateBookDto.authorId;
        }
        Object.assign(book, updateBookDto);
        return this.bookRepository.save(book);
    }
    async remove(id) {
        const book = await this.findOne(id);
        await this.bookRepository.remove(book);
    }
    async findByAuthor(authorId) {
        return this.bookRepository.find({
            where: { author: { id: authorId } },
            relations: ['author'],
        });
    }
    async findAllPaginated(page = 1, limit = 10) {
        return this.bookRepository.findAndCount({
            relations: ['author'],
            skip: (page - 1) * limit,
            take: limit,
            order: { price: 'ASC' },
        });
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(1, (0, typeorm_1.InjectRepository)(author_entity_1.Author)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BooksService);
//# sourceMappingURL=books.service.js.map