import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { Order } from "../../orders/entities/order.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException("Email already exists");
    }
    if (createUserDto.age < 0) {
      throw new BadRequestException("Age cannot be negative");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["orders"],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    await this.ensureEmailIsUnique(updateUserDto.email, id);
    this.validateAge(updateUserDto.age);

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return this.findOne(id);
  }

  async getProfile(id: number): Promise<User> {
    return this.findOne(id);
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findOne(id);
    await this.ensureEmailIsUnique(updateProfileDto.email, id);
    this.validateAge(updateProfileDto.age);

    Object.assign(user, updateProfileDto);
    await this.userRepository.save(user);
    return this.findOne(id);
  }

  async findOrdersByUserId(userId: number): Promise<Order[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["orders", "orders.books"],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user.orders;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  private async ensureEmailIsUnique(email?: string, currentUserId?: number) {
    if (!email) {
      return;
    }

    const existing = await this.userRepository.findOne({
      where: { email },
    });

    if (existing && existing.id !== currentUserId) {
      throw new ConflictException("Email already in use");
    }
  }

  private validateAge(age?: number) {
    if (age !== undefined && age < 0) {
      throw new BadRequestException("Age cannot be negative");
    }
  }
}
