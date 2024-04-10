import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateDateColumn, IsNull, UpdateDateColumn } from "typeorm";

export class UpdateFundraiserDto {

        @ApiProperty()
        @IsString()
        @IsNotEmpty({message:"First Name is required"})
        @IsOptional()
        firstName:string;

        @ApiProperty()
        @IsString()
        @IsOptional()
        lastName:string;

        @ApiProperty()
        @IsOptional()
        @IsNumber()
        mobile_number:number;

        @ApiProperty()
        @IsString()
        @IsOptional()
        profilePicture:string;

        @ApiProperty()
        @IsString()
        @IsOptional()
        address:string;

        @ApiProperty()
        @IsString()
        @IsOptional()
        city:string;

        @ApiProperty()
        @IsString()
        @IsOptional()
        state:string

        @ApiProperty()
        @IsString()
        @IsOptional()
        country:string
        
        @ApiProperty()
        @IsNumber()
        @IsOptional()
        pincode:number

        @ApiProperty()
        @IsString()
        @IsOptional()
        dob:string

        @ApiProperty()
        @IsString()
        @IsOptional()
        pan:string
}
