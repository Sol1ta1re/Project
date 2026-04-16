import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AuthorsModule } from "./authors/authors.module";
import { BooksModule } from "./books/books.module";
import { OrdersModule } from "./orders/orders.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      database: "postgres",
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    AuthorsModule,
    BooksModule,
    OrdersModule,
  ],
})
export class AppModule {}
