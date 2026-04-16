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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("../../books/entities/book.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const order_entity_1 = require("../entities/order.entity");
let OrdersService = class OrdersService {
    orderRepository;
    userRepository;
    bookRepository;
    constructor(orderRepository, userRepository, bookRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }
    async create(currentUser, createOrderDto) {
        const { bookIds } = createOrderDto;
        const user = await this.userRepository.findOne({ where: { id: currentUser.id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${currentUser.id} not found`);
        }
        const books = await this.bookRepository.find({
            where: { id: (0, typeorm_2.In)(bookIds) },
        });
        const uniqueBookIds = [...new Set(bookIds)];
        if (books.length !== uniqueBookIds.length) {
            const foundIds = books.map((book) => book.id);
            const missing = uniqueBookIds.filter((id) => !foundIds.includes(id));
            throw new common_1.NotFoundException(`Books with ids ${missing.join(", ")} not found`);
        }
        for (const book of books) {
            if (book.stock <= 0) {
                throw new common_1.BadRequestException(`Book "${book.title}" is out of stock`);
            }
        }
        const orderedBooks = bookIds.map((bookId) => {
            const book = books.find((item) => item.id === bookId);
            if (!book) {
                throw new common_1.NotFoundException(`Book with id ${bookId} not found`);
            }
            return book;
        });
        const totalPrice = orderedBooks.reduce((sum, book) => sum + Number(book.price), 0);
        for (const book of orderedBooks) {
            book.stock -= 1;
            await this.bookRepository.save(book);
        }
        const order = this.orderRepository.create({
            user,
            books: orderedBooks,
            totalPrice,
            status: order_entity_1.OrderStatus.NEW,
        });
        return this.orderRepository.save(order);
    }
    async findAll(currentUser) {
        if (currentUser.role === user_entity_1.UserRole.ADMIN) {
            return this.orderRepository.find({ relations: ["user", "books"] });
        }
        return this.orderRepository.find({
            where: { user: { id: currentUser.id } },
            relations: ["user", "books"],
        });
    }
    async findOne(id, currentUser) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ["user", "books"],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        this.ensureOrderAccess(order, currentUser);
        return order;
    }
    async update(id, currentUser, updateOrderDto) {
        const order = await this.findOne(id, currentUser);
        if (!updateOrderDto.status) {
            return order;
        }
        if (currentUser.role === user_entity_1.UserRole.USER && updateOrderDto.status !== order_entity_1.OrderStatus.CANCELLED) {
            throw new common_1.ForbiddenException("User can only cancel their own order");
        }
        if (updateOrderDto.status === order_entity_1.OrderStatus.CANCELLED &&
            order.status !== order_entity_1.OrderStatus.CANCELLED) {
            for (const book of order.books) {
                book.stock += 1;
                await this.bookRepository.save(book);
            }
        }
        order.status = updateOrderDto.status;
        return this.orderRepository.save(order);
    }
    async remove(id, currentUser) {
        const order = await this.findOne(id, currentUser);
        if (order.status !== order_entity_1.OrderStatus.CANCELLED) {
            for (const book of order.books) {
                book.stock += 1;
                await this.bookRepository.save(book);
            }
        }
        await this.orderRepository.remove(order);
    }
    ensureOrderAccess(order, currentUser) {
        if (currentUser.role === user_entity_1.UserRole.ADMIN) {
            return;
        }
        if (order.user.id !== currentUser.id) {
            throw new common_1.ForbiddenException("You do not have access to this order");
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map