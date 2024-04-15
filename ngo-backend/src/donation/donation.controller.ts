import { Body, Controller, Param, ParseIntPipe, ParseUUIDPipe, Post, Req, ValidationPipe } from '@nestjs/common';
import { DonationService } from './donation.service';
import { Public } from 'src/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { DonateDto } from './dto/donate.dto';

@ApiTags("Donation")
@Controller()
export class DonationController {
  constructor(private readonly donationService: DonationService
    ) {}

    @Post("/donate")
    @Public()
    async donate(@Body(ValidationPipe)body:DonateDto){
      await this.donationService.donate(body);
    }
  

  @Post("/fundraiser-page/:id/donate")
  @Public()
  async donateToFundRaiser(@Body(ValidationPipe)body:DonateDto,@Param("id",ParseUUIDPipe) id:string){
    console.log(id)
    await this.donationService.donate(body,id);
  }


}
