import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class UpdateFileDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}