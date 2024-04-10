import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, UnauthorizedException, BadRequestException, UseInterceptors, UploadedFile, Res, NotFoundException } from '@nestjs/common';
import { UserService, storage } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '../fundraiser/dto/change-password.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import * as path from 'path';
import {v4 as uuidv4} from "uuid";
import { User } from './entities/user.entity';
import { UserRepository } from './repo/user.repository';
import { Fundraiser } from 'src/fundraiser/entities/fundraiser.entity';
import { Donation } from 'src/donation/entities/donation.entity';
import { Public } from 'src/public.decorator';


@ApiTags("User")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly userRepository:UserRepository) {}


  //signUp Route
  @Post("/signUp")
  @Public()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findUserByEmail(createUserDto.email);
    if(existingUser){
      throw new BadRequestException("Email already in use")
    }
    else{
    return this.userService.create(createUserDto);
    }
  }

  //getUserDetails
  @ApiSecurity("JWT-auth")
  @Get()
  async getUser(@Req() req){
    const id = req.user;
    try {
      return await this.userRepository.findOneOrFail({where:{email:id.email}});

    } catch (error) {
      throw new NotFoundException("User not found");
    }
  }
  
  //uploadProfilePic
  @ApiSecurity("JWT-auth")
  @Post("upload")
  @UseInterceptors(FileInterceptor("file",storage))
  async uploadFile(@UploadedFile() file,@Req() req){
    let user:User = req.user;
    console.log(user)
    return await this.userRepository.update(user.id,{profileImage:file.filename})
    // return of({imagePath: file.filename});
  }

  //getProfileImage
  @ApiSecurity("JWT-auth")
  @Get("profile-image/:imagename")
  findProfileImage(@Param("imagename") imagename,@Res() res){
    return of(res.sendFile(path.join(process.cwd(), "uploads/profileImages/"+ imagename)));
  }

  @Get("/donations")
  async getDonationsById(@Req() req){
    let user:User = req.user;
    return await this.userService.getDonationByIdFundraiser(user)
  }


    // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

}
