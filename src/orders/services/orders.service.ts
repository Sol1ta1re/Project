import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { AuthUser } from "../../auth/types/auth-user";
import { Book } from "../../books/entities/book.entity";
import { User, UserRole } from "../../users/entities/user.entity";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { Order, OrderStatus } from "../entities/order.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(currentUser: AuthUser, createOrderDto: CreateOrderDto): Promise<Order> {
    const { bookIds } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: currentUser.id } });
    if (!user) {
      throw new NotFoundException(`User with id ${currentUser.id} not found`);
    }

    const books = await this.bookRepository.find({
      where: { id: In(bookIds) },
    });

    const uniqueBookIds = [...new Set(bookIds)];
    if (books.length !== uniqueBookIds.length) {
      const foundIds = books.map((book) => book.id);
      const missing = uniqueBookIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Books with ids ${missing.join(", ")} not found`);
    }

    for (const book of books) {
      if (book.stock <= 0) {
        throw new BadRequestException(`Book "${book.title}" is out of stock`);
      }
    }

    const orderedBooks = bookIds.map((bookId) => {
      const book = books.find((item) => item.id === bookId);
      if (!book) {
        throw new NotFoundException(`Book with id ${bookId} not found`);
      }
      return book;
    });

    const totalPrice = orderedBooks.reduce(
      (sum, book) => sum + Number(book.price),
      0,
    );

    for (const book of orderedBooks) {
      book.stock -= 1;
      await this.bookRepository.save(book);
    }

    const order = this.orderRepository.create({
      user,
      books: orderedBooks,
      totalPrice,
      status: OrderStatus.NEW,
    });

    return this.orderRepository.save(order);
  }

  async findAll(currentUser: AuthUser): Promise<Order[]> {
    if (currentUser.role === UserRole.ADMIN) {
      return this.orderRepository.find({ relations: ["user", "books"] });
    }

    return this.orderRepository.find({
      where: { user: { id: currentUser.id } },
      relations: ["user", "books"],
    });
  }

  async findOne(id: number, currentUser: AuthUser): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ["user", "books"],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    this.ensureOrderAccess(order, currentUser);
    return order;
  }

  async update(
    id: number,
    currentUser: AuthUser,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findOne(id, currentUser);

    if (!updateOrderDto.status) {
      return order;
    }

    if (currentUser.role === UserRole.USER && updateOrderDto.status !== OrderStatus.CANCELLED) {
      throw new ForbiddenException("User can only cancel their own order");
    }

    if (
      updateOrderDto.status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      for (const book of order.books) {
        book.stock += 1;
        await this.bookRepository.save(book);
      }
    }

    order.status = updateOrderDto.status;
    return this.orderRepository.save(order);
  }

  async remove(id: number, currentUser: AuthUser): Promise<void> {
    const order = await this.findOne(id, currentUser);

    if (order.status !== OrderStatus.CANCELLED) {
      for (const book of order.books) {
        book.stock += 1;
        await this.bookRepository.save(book);
      }
    }

    await this.orderRepository.remove(order);
  }

  private ensureOrderAccess(order: Order, currentUser: AuthUser) {
    if (currentUser.role === UserRole.ADMIN) {
      return;
    }

    if (order.user.id !== currentUser.id) {
      throw new ForbiddenException("You do not have access to this order");
    }
  }
}
