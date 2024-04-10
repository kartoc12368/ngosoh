import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsDecimal, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DonateDto{

    @ApiProperty()
    @IsDecimal()
    @IsNotEmpty()
    amount:number

    @ApiProperty()
    @IsAlpha()
    name:string;

}