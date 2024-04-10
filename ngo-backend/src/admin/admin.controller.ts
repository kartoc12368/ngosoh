import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { sendEmailDto } from 'src/mailer/mail.interface';
import { MailerService } from 'src/mailer/mailer.service';
import { UserRepository } from 'src/user/repo/user.repository';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { GeneratePasswordDto } from './dto/generate-password.dto';
import { FundraiserService } from 'src/fundraiser/fundraiser.service';
import { AddOfflineDonationDto } from './dto/offline-donation.dto';
import { FundRaiserRepository } from 'src/fundraiser/repo/fundraiser.repository';

@UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
@ApiTags("Admin")
@ApiSecurity("JWT-auth")
@Controller('admin')
export class AdminController {  
  constructor(private readonly adminService: AdminService,
    private mailerService:MailerService,
    private userRepository:UserRepository,
    private projectService:ProjectService,
    private userService:UserService,
    private fundraiserRepository:FundRaiserRepository
    ) {}

  //change fundraiser status
  @Post("/fundraiser/status/:id")
  changeFundraiserStatus(@Param('id',ParseIntPipe) id: number) {
    return this.adminService.changeFundraiserStatus(id);
  }
  
 //delete fundraiser
  @Delete("/fundraiser/delete/:id")
  deleteFundraiser(@Param('id',ParseIntPipe) id: number) {
    return this.adminService.deleteFundraiser(id);
  }

  //get all fundraiser
  @Get("/fundraiser")
  getAllFundraiser() {
    return this.adminService.getAllFundraiser();
  }

  //generate password for fundraiser
  @Post("/generate")
 async generatePasswordByEmail(@Body(ValidationPipe) body:GeneratePasswordDto){
  const isUserExists = await this.userRepository.findOne({where:{email: body.email}})
  if(isUserExists && isUserExists.role == "FUNDRAISER"){
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

  //delete User
  @Delete("/user/delete/:id")
  deleteUser(@Param('id',ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  //get all projects
  @Get("projects")
  getProjects(){
    return this.projectService.getProjects();
  }

  //get project by id
  @Get("project/:id")
  async getProjectById(@Param("id",ParseIntPipe) project_id:number){
    return await this.projectService.getProjectById(project_id)
  }

    //Get-all user route
    @Get("/user")
    findAll(@Req()req) {
      return this.userService.findAll();
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



}
