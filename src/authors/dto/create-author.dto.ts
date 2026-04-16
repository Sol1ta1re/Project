import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsInt()
  @Min(-4000)
  @Max(new Date().getFullYear())
  birthYear: number;
}
