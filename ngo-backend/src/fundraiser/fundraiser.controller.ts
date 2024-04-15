import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FundraiserService } from './fundraiser.service';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FundRaiserRepository } from './repo/fundraiser.repository';
import { UpdateFundraiserDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {v4 as uuidv4} from "uuid";
import { of } from 'rxjs';
import * as path from 'path';
import { Fundraiser } from './entities/fundraiser.entity';
import { diskStorage } from 'multer';
import { FundraiserPage } from 'src/fundraiser-page/entities/fundraiser-page.entity';
import { FundraiserPageRepository } from 'src/fundraiser-page/repo/fundraiser-page.repository';
import { FindDonationsDto } from './dto/find-donation.dto';
import * as exceljs from "exceljs";
import { DonationRepository } from 'src/donation/repo/donation.repository';
import { Public } from 'src/public.decorator';
import * as fs from "fs"

export const storage =   {  storage:diskStorage({
   destination:"./uploads/profileImages", filename:(req,file,cb)=>{ 
    const filename:string = path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4(); 
    const extension:string = path.parse(file.originalname).ext; 
    cb(null, `${filename}${extension}`) } }) }
    
@ApiTags("FundRaiser")
@ApiSecurity("JWT-auth")
@UseGuards(new RoleGuard(Constants.ROLES.FUNDRAISER_ROLE))
@Controller('fundRaiser')
export class FundraiserController {
  constructor(private readonly fundraiserService: FundraiserService,
    private fundRaiserRepository:FundRaiserRepository,
    private fundraiserPageRepository:FundraiserPageRepository,
    private donationRepository:DonationRepository,
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
    let fundRaiser:Fundraiser = await this.fundRaiserRepository.findOne({where:{fundraiser_id:req.user.id}})
    return this.fundraiserService.getFundraiserPage(fundRaiser);
  }
  
  //upload fundraiser profileImage
  @Post("upload")
  @UseInterceptors(FileInterceptor("file",storage))
  async uploadFile(@UploadedFile() file,@Req() req){
    let fundraiser:Fundraiser = req.user;
    let fundRaiser = await this.fundraiserService.findFundRaiserByEmail(fundraiser.email)
    await this.fundRaiserRepository.update(fundRaiser.fundraiser_id,{profileImage:file.filename})
    return await this.fundRaiserRepository.update(fundRaiser.fundraiser_id,{profileImage:file.filename})
  }

  //get fundraiser ProfileImage
  @Get("profile-image/:imagename")
  findProfileImage(@Param("imagename") imagename,@Res() res){
    return of(res.sendFile(path.join(process.cwd(), "uploads/profileImages/"+ imagename)));
  }



  // @Get("/donations")
  // async getDonationsById(@Req() req){
  //   let fundraiser:Fundraiser=req.user
  //   return await this.fundraiserService.getDonationByIdFundraiser(fundraiser)
  // }

  @ApiSecurity("JWT-auth")
  @UseGuards(new RoleGuard(Constants.ROLES.FUNDRAISER_ROLE))  
  @Post("/createPage")
  async createPage(@Req() req){
    try{
    let fundRaiser = await this.fundraiserService.findFundRaiserByEmail(req.user.email)
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
  catch(error){
    throw new NotFoundException("Fundraiser does not exist")
  }
}

@Get("/donations")
async findAll(@Query() query:FindDonationsDto,@Req() req){
  return await this.fundraiserService.findMany(query,req)
}

// @Get("/donations/download")
// async downloadExcel(@Req() req,@Res() res){
//   try {
//     // let donations = await this.donationRepository.find({where:{fundraiser:{fundraiser_id:req.user.id}}})
//     let donations = await this.donationRepository.find();
//     let workbook = new exceljs.Workbook();

//     const sheet = workbook.addWorksheet("donations")
//     sheet.columns = [
//       { header: "Donation Id", key: "donation_id_frontend" },
//       { header: "Donation Date", key: "created_at" } ,
//       { header: "Donation Amount", key: "amount" },
//     ]

//    await donations.map((value,idx)=>{
//       sheet.addRow({
//         donation_id_frontend:value.donation_id_frontend,
//         created_at:value.created_at,
//         amount:value.amount,
//       });
//     });
    
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"); 
//     res.setHeader("Content-Disposition", "attachment; filename=donations.xlsx");

//     workbook.xlsx.write(res)
//   } catch (error) {
//     console.log(error);
//   }
// }

@Get('/donations/download')
async downloadExcel(@Req() req, @Res() res) {
  try {
    const donations = await this.donationRepository.find({
      where: { fundraiser: { fundraiser_id: req.user.id } }, // Filter by fundraiser
    });

    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('donations');
    sheet.columns = [
      { header: 'Donation Id', key: 'donation_id_frontend' },
      { header: 'Donation Date', key: 'created_at' },
      {header: 'Donor Name', key: 'donor_name' },
      { header: 'Donation Amount', key: 'amount' },
      {header: 'Payment Type', key: 'payment_type' },
      {header:'Payment Status', key: 'payment_status'},
      {header:'80G Certificate', key:'certificate'}
    ];

    donations.forEach((value, idx) => {
      sheet.addRow({
        donation_id_frontend: value.donation_id_frontend,
        created_at: value.created_at,
        donor_name: value.donor_name,
        amount: value.amount,
        payment_type:value.payment_type,
        payment_status:value.payment_status,
        certificate:value.certificate
      });
    });

    const downloadsFolder = path.join(__dirname, '../..', 'downloads');
    if (!fs.existsSync(downloadsFolder)) {
      try {
        fs.mkdirSync(downloadsFolder);
      } catch (error) {
        console.error('Error creating downloads folder:', error);
        // Handle the error gracefully
      }
    }

    const filename = `${uuidv4()}.xlsx`;
    const filePath = path.join(downloadsFolder, filename);

    await workbook.xlsx.writeFile(filePath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.end();
  } catch (error) {
    console.error('Error creating Excel file:', error);
  }
}

@Get("/fundraiser-page/:filename")  
downloadReport(@Param("filename") filename,@Res() res){
  return of(res.sendFile(path.join(process.cwd(), "uploads/fundraiserPageImages/"+ filename)));
}


}
