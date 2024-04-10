import { ApiProperty } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { IsAlpha, IsDecimal, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateFundraiserPageDto{

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    target_amount:number

    @ApiProperty()
    @IsString()
    resolution:string

    @ApiProperty()
    @IsString()
    about:string

    @ApiProperty()
    @IsString()
    money_raised_for:string

    constructor(body?: any) {
        // Initialize the properties based on the provided body data, if any
        if (body) {
          // Assign the properties from the body to the DTO instance
          this.target_amount = body.target_amount;
          this.resolution = body.resolution;
          this.about = body.about;
          this.money_raised_for = body.money_raised_for;
        }
      }
    

}
