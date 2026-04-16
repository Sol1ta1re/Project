import {
  IsString,
  IsNumber,
  Min,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsPositive()
  publishedYear: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;
}
