import { IsNotEmpty, IsNumberString } from "class-validator";

export class DowloadFileDto {
    @IsNumberString()
    @IsNotEmpty()
    id: string;
}