import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FundraiserPageService } from './fundraiser-page.service';
import { FundraiserService } from 'src/fundraiser/fundraiser.service';
import { Public } from 'src/public.decorator';
import { FundRaiserRepository } from 'src/fundraiser/repo/fundraiser.repository';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { DonationRepository } from 'src/donation/repo/donation.repository';
import { FundraiserPageRepository } from './repo/fundraiser-page.repository';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { FundraiserPage } from './entities/fundraiser-page.entity';
import { UpdateFundraiserPageDto } from './dto/update-fundraiser-page.dto';
import { OwnershipGuard } from './guard/ownership.guard';

@ApiTags("Fundraiser-Page")
@Controller('fundraiser-page')
export class FundraiserPageController {
  constructor(private readonly fundraiserPageService: FundraiserPageService,
    private readonly fundRaiserRepository:FundRaiserRepository,
    private readonly fundraiserService:FundraiserService,
    private readonly fundraiserPageRepository:FundraiserPageRepository
    ) {}

  @ApiSecurity("JWT-auth")
  @UseGuards(new RoleGuard(Constants.ROLES.FUNDRAISER_ROLE))  
  @Post("/createPage")
  async createPage(@Req() req){
    let user:User = req.user;
    let fundRaiser = await this.fundraiserService.findFundRaiserByEmail(user.email)
    const fundraiserPage:FundraiserPage = new FundraiserPage();
    fundraiserPage.supporters = []
    fundraiserPage.gallery = []
    fundraiserPage.fundraiser = fundRaiser;
    await this.fundraiserPageRepository.save(fundraiserPage);
    return fundraiserPage;
  }

  @ApiSecurity("JWT-auth")
  @UseGuards(new RoleGuard(Constants.ROLES.FUNDRAISER_ROLE),OwnershipGuard)
  @Put("/:id/updatePage")
  @UseInterceptors(FilesInterceptor("file",20,storage))
  async updatePage(@UploadedFiles() files,@Req() req,@Body() body,@Param("id")id:number){
    let user:User = req.user;
    body = JSON.parse(body.data)

    const project_name = body.project_name
    const dtoInstance = new UpdateFundraiserPageDto(body);
    const dtoKeys = Object.keys(dtoInstance);
    // console.log(dtoKeys)

  
    // Filter out extra parameters from the body
    const filteredBody = Object.keys(body)
      .filter(key => dtoKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {});
  
    // console.log(filteredBody)
    const response = [];
    try {
      files.forEach(file => {
        // const fileReponse = {
        //   filename: file.filename,
        // };
        response.push(file.filename);
        // console.log(response)
      });
    
    } catch (error) {
      return true;
    }
return await this.fundraiserPageService.update(filteredBody,response,id,project_name,user)
  }


    //public page for fundraiser
    @Get(":id")
    @Public()
    async getFundraiserById(@Param("id",ParseIntPipe) id:number){
      try {
        const fundraiserPage = await this.fundraiserPageRepository.findOne({where:{id:id}});
        if (!fundraiserPage) {
          throw new NotFoundException('Fundraiser not found');
        }
        return fundraiserPage;
      } catch (error) {
        throw new NotFoundException("Fundraiser Page not found")
      }
    }
  
}
