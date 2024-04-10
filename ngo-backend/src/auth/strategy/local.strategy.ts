import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { UserRepository } from "src/user/repo/user.repository";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private userService: UserService,
        private userRepository: UserRepository){
        super({
            usernameField: 'email',
            passwordField: 'password',
        })
    }

    async validate(email:string, password:string): Promise<User>{
        const user: User = await this.userService.findUserByEmail(email);
        const userPassword = await this.userRepository.findOne({where: {email: email},select:["password"]})
        if(user && (await bcrypt.compare(password,userPassword.password))){
            return user;
        }
        if(user == undefined){
            throw new UnauthorizedException("User not found:"+ email
            );
        }
        if(!(await bcrypt.compare(password,userPassword.password))){
            throw new UnauthorizedException("Invalid password"
            );
        }
        return null;
    }
}