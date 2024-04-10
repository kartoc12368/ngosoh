import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddOfflineDonationDto{

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    fundraiser_id:number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    fundraiserPage_id:number;    

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    Name:string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount:number;

}