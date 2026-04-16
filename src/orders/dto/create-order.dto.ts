import { ArrayMinSize, IsArray, IsNumber } from "class-validator";

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  bookIds: number[];
}
