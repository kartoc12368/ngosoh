import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindDonationsDto {

@IsString()    
@IsOptional()
payment_option?:string;

@IsString() 
@IsOptional()
payment_status?:string;

@IsString()  
@IsOptional()
from_date?:string;

@IsString()  
@IsOptional()
to_date?:string;

@IsString()   
@IsOptional()
donation_id?:string;
}
