import { Body, Controller, Get, Post, Req, UseGuards ,Param, NotFoundException, Res, ValidationPipe} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt"
import { UserService } from "src/user/user.service";
import { sendEmailDto } from "src/mailer/mail.interface";
import { MailerService } from "src/mailer/mailer.service";
import { AdminService } from "src/admin/admin.service";
import { FundraiserService } from "src/fundraiser/fundraiser.service";
import { AuthService} from "src/auth/auth.service"
import { ForgottenPasswordRepository } from "./repo/forgot-password.repo";
import { UserRepository } from "src/user/repo/user.repository";
import { response } from "express";
import { Public } from "src/public.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@ApiTags("Login")
@Controller("auth")
export class AuthController {

    constructor(private jwtService: JwtService,
        private userService: UserService,
        private fundraiserService:FundraiserService,
        private authService:AuthService,
        private forgottenPasswordRepository:ForgottenPasswordRepository,
        private userRepository:UserRepository
        ){}

    //Login Route
    @UseGuards(AuthGuard("local"))
    @Public()
    @Post("/login")
    async login(@Req() req, @Body(ValidationPipe) loginDto: LoginDto,@Res({passthrough:true}) response){
        //jwt token
        const user : User = req.user;
        if((user.role=="FUNDRAISER" && await this.fundraiserService.getFundRaiserStatusByEmail(user.email)=="active" ) ||(user.role=="NORMAL_USER_ROLE") || (user.role=="ADMIN")){
            const userPassword = await this.userRepository.findOne({where: {email: user.email},select:["password"]})    
        
        if(user && (await bcrypt.compare(loginDto.password,userPassword.password))){
            const payload = {
                "firstName": user.firstName,
                "email": user.email,
                "role": user.role,
                "userId": user.id,
                "profileImage":user.profileImage   
            }
            return {token: this.jwtService.sign(payload)};   
            // return this.authService.issueTokens(user, response); // Issue tokens on login
 
        }
        else{
            return null;
        }      
    }
    else{
        return "Please contact the administrator";
    } 
    }


    //forgot password otp send
    @Public()
    @Get("forgot-password")
    public async sendEmailForgotPassword(@Body(ValidationPipe) body:ForgotPasswordDto){
        return await this.authService.sendEmailForgotPassword(body.email);
    }

    //verify otp and update password
    @Public()
    @Post("reset-password")
    async setNewPassword(@Body(ValidationPipe)body:ResetPasswordDto){
        var user = await this.forgottenPasswordRepository.findOne({where:{newPasswordToken:body.otp}})
        if(!user){
            throw new NotFoundException("Invalid Otp")
        }
        else{
            var user_new = await this.userService.findUserByEmail(user.email)
            const password = body.newPassword
            const hashedPassword = await bcrypt.hash(password,10)
            var status = await this.userRepository.update(user_new.id,{password:hashedPassword})
            if(status){
            await this.forgottenPasswordRepository.remove(user)}
            return "Success"

        }
        

        }

}