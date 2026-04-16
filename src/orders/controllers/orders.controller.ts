import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../auth/decorator/current-user.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import * as authUser from "../../auth/types/auth-user";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { OrdersService } from "../services/orders.service";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @CurrentUser() user: authUser.AuthUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(user, createOrderDto);
  }

  @Get()
  findAll(@CurrentUser() user: authUser.AuthUser) {
    return this.ordersService.findAll(user);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: authUser.AuthUser,
  ) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: authUser.AuthUser,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, user, updateOrderDto);
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: authUser.AuthUser,
  ) {
    return this.ordersService.remove(id, user);
  }
}
