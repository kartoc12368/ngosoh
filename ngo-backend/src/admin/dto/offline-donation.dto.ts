import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsDecimal, IsEmail, IsNotEmpty,IsNumber,IsNumberString, IsOptional, IsString} from "class-validator";

export class AddOfflineDonationDto{

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount:number;

    @ApiProperty()
    @IsAlpha()
    @IsNotEmpty()
    donor_name:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    pan:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    donor_email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    donor_phone: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    donor_address: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    comments:string;

}