import { Body, Controller, Get, NotFoundException, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FundraiserService } from './fundraiser.service';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FundRaiserRepository } from './repo/fundraiser.repository';
import { UpdateFundraiserDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repo/user.repository';
import { of } from 'rxjs';
import * as path from 'path';
import { Fundraiser } from './entities/fundraiser.entity';

@ApiTags("FundRaiser")
@ApiSecurity("JWT-auth")
@UseGuards(new RoleGuard(Constants.ROLES.FUNDRAISER_ROLE))
@Controller('fundRaiser')
export class FundraiserController {
  constructor(private readonly fundraiserService: FundraiserService,
    private fundRaiserRepository:FundRaiserRepository,
    private userRepository:UserRepository
  ) {}

  //change Password Fundraiser
  @Post("/changePassword")
  async changePassword(@Req() req,@Body() changePasswordDto:ChangePasswordDto){
    await this.fundraiserService.changePassword(req,changePasswordDto)
    return "Password Changed Successfully";
  }

  //get fundraiser details
  @Get()
  async getFundraiser(@Req() req){
    const id = req.user;
    try {
      return await this.fundRaiserRepository.findOneOrFail({where:{email:id.email}});

    } catch (error) {
      throw new NotFoundException("Fundraiser not found");
    }
  }


  //update fundraiser details
  @Put("/update")
  async updateFundraiser(@Req() req,@Body(ValidationPipe)body:UpdateFundraiserDto){
    return this.fundraiserService.updateFundRaiserById(req,body)
  }

  @Get("/fundraiser-page")
  async getAllFundraiserPages(@Req() req){
    let fundRaiser:Fundraiser = await this.fundRaiserRepository.findOne({where:{fundraiser_id:req.id}})
    return this.fundraiserService.getAllFundraiserPages(fundRaiser);
  }

  //upload fundraiser profileImage
  @Post("upload")
  @UseInterceptors(FileInterceptor("file",storage))
  async uploadFile(@UploadedFile() file,@Req() req){
    let user:User = req.user;
    let fundRaiser = await this.fundraiserService.findFundRaiserByEmail(user.email)
    await this.fundRaiserRepository.update(fundRaiser.fundraiser_id,{profileImage:file.filename})
    return await this.userRepository.update(user.id,{profileImage:file.filename})
  }

  //get fundraiser ProfileImage
  @Get("profile-image/:imagename")
  findProfileImage(@Param("imagename") imagename,@Res() res){
    return of(res.sendFile(path.join(process.cwd(), "uploads/profileImages/"+ imagename)));
  }



  @Get("/donations")
  async getDonationsById(@Req() req){
    let user:User = req.user;
    return await this.fundraiserService.getDonationByIdFundraiser(user)
  }
}
