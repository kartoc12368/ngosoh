import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { sendEmailDto } from 'src/mailer/mail.interface';
import { MailerService } from 'src/mailer/mailer.service';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { GeneratePasswordDto } from './dto/generate-password.dto';
import { FundraiserService } from 'src/fundraiser/fundraiser.service';
import { AddOfflineDonationDto } from './dto/offline-donation.dto';
import { FundRaiserRepository } from 'src/fundraiser/repo/fundraiser.repository';
import { Fundraiser } from 'src/fundraiser/entities/fundraiser.entity'
import { FundraiserPageRepository } from 'src/fundraiser-page/repo/fundraiser-page.repository';
import { FundraiserPage } from 'src/fundraiser-page/entities/fundraiser-page.entity';
@UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
@ApiTags("Admin")
@ApiSecurity("JWT-auth")
@Controller('admin')
export class AdminController {  
  constructor(private readonly adminService: AdminService,
    private mailerService:MailerService,
    private fundraiserRepository:FundRaiserRepository,
    private fundraiserService:FundraiserService,
    private fundraiserPageRepository:FundraiserPageRepository,
    private fundraiserPage:FundraiserPage
    ) {}

  //change fundraiser status
  @Post("/fundraiser/status/:id")
  changeFundraiserStatus(@Param('id',ParseIntPipe) id: number) {
    return this.adminService.changeFundraiserStatus(id);
  }
  
 //delete fundraiser
  @Delete("/fundraiser/delete/:id")
  async deleteFundraiser(@Param('id',ParseIntPipe) id: number) {
    try{
    let user = await this.fundraiserRepository.findOne({where:{fundraiser_id:id}})
    if(user.role=="ADMIN"){
      throw new ForbiddenException("NOT ALLOWED")
    }
    return this.adminService.deleteFundraiser(id);
  }
  catch(error){
    throw new NotFoundException("Fundraiser Does not exist")
  }
  }

  //get all fundraiser
  @Get("/fundraiser")
  getAllFundraiser() {
    return this.adminService.getAllFundraiser();
  }

  //generate password for fundraiser
  @Post("/generate")
 async generatePasswordByEmail(@Body(ValidationPipe) body:GeneratePasswordDto){
  const isFundraiserExists = await this.fundraiserRepository.findOne({where:{email: body.email}})
  if(isFundraiserExists && isFundraiserExists.role == "FUNDRAISER"){
    throw new BadRequestException("Email already in use")
  }    
else{
      //generating random password in randomPassword variable
      var randomPassword = Math.random().toString(36).slice(-8);
      var body2 = {
          "firstName":body.firstName,
          "password":randomPassword
      }
      const dto:sendEmailDto = {
          // from: {name:"Lucy", address:"lucy@example.com"},
          recipients: [{name: body.firstName, address:body.email}],
          subject: "FundRaiser Password",
          html: "<p>Hi {firstName}, Login to Portal using:{password} </p><p><strong>Cheers!</strong></p>",
          placeholderReplacements:body2
        };
        await this.mailerService.sendMail(dto);
          
      return this.adminService.createdByAdmin(body, randomPassword)
}
  }

    @Post("/addOfflineDonation")
    async addOfflineDonation(@Req() req, @Body() body:AddOfflineDonationDto){
      if(await this.fundraiserRepository.findOne({where:{fundraiser_id:body.fundraiser_id}})){
        return await this.adminService.addOfflineDonation(body)
      }
      else{
        return "Fundraiser Not Found  "
      }

      
    }

    @ApiSecurity("JWT-auth")
    @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))  
    @Post("/createPage")
    async createPage(@Req() req){
      let fundraiser:Fundraiser = req.user;
      let fundRaiser = await this.fundraiserService.findFundRaiserByEmail(fundraiser.email)
      let fundRaiserPage = await this.fundraiserPageRepository.findOne({where:{fundraiser:{fundraiser_id:fundRaiser.fundraiser_id}}})
      console.log(fundRaiserPage)
      if(fundRaiserPage==null){
      const fundraiserPage:FundraiserPage = new FundraiserPage();
      fundraiserPage.supporters = []
      fundraiserPage.gallery = []
      fundraiserPage.fundraiser = fundRaiser;
      await this.fundraiserPageRepository.save(fundraiserPage);
      return fundraiserPage;
      }
      else{
        return "Fundraiser Page already exists"
      }
    }
  

}
