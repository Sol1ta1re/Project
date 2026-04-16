import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../auth/decorator/current-user.decorator";
import { Roles } from "../../auth/decorator/roles.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import * as authUser from "../../auth/types/auth-user";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserRole } from "../entities/user.entity";
import { UsersService } from "../services/users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("me")
  me(@CurrentUser() user: authUser.AuthUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch("me")
  updateMe(
    @CurrentUser() user: authUser.AuthUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id/orders")
  findUserOrders(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: authUser.AuthUser,
  ) {
    if (user.role !== UserRole.ADMIN && user.id !== id) {
      throw new ForbiddenException("You can view only your own orders");
    }

    return this.usersService.findOrdersByUserId(id);
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
