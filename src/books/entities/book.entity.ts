import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  publishedYear: number;

  @Column()
  stock: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Author, (author) => author.books)
  author: Author;

  @ManyToMany(() => Order, (order) => order.books)
  orders: Order[];
}
