import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Book])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
