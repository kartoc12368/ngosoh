import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsDecimal, IsNotEmpty} from "class-validator";

export class DonateDto{

    @ApiProperty()
    @IsDecimal()
    @IsNotEmpty()
    amount:number

    @ApiProperty()
    @IsAlpha()
    name:string;

}