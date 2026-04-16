import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsInt()
  @Min(-4000)
  @Max(new Date().getFullYear())
  birthYear?: number;
}
