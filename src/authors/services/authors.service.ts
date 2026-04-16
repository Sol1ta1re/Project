// src/authors/authors.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    if (!createAuthorDto.name) {
      throw new BadRequestException('Author name is required');
    }
    const currentYear = new Date().getFullYear();
    if (createAuthorDto.birthYear > currentYear) {
      throw new BadRequestException('Birth year cannot be in the future');
    }
    const author = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(author);
  }

  async findAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    await this.findOne(id);
    if (updateAuthorDto.birthYear) {
      const currentYear = new Date().getFullYear();
      if (updateAuthorDto.birthYear > currentYear) {
        throw new BadRequestException('Birth year cannot be in the future');
      }
    }
    await this.authorRepository.update(id, updateAuthorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    if (author.books && author.books.length > 0) {
      throw new ConflictException(
        'Cannot delete author with existing books. Remove books first or reassign them.',
      );
    }
    await this.authorRepository.remove(author);
  }
}
