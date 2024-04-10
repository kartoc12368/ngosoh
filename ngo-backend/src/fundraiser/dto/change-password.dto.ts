import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:"old password is required"})
    oldPassword: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:"newpassword is required"})
    newPassword: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:"confirmpassword is required"})
    confirmPassword: string;


}
