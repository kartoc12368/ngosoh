import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FundRaiserRepository } from './repo/fundraiser.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Fundraiser } from './entities/fundraiser.entity';
import * as bcrypt from 'bcrypt';
import { UpdateFundraiserDto } from './dto/update-profile.dto';
import { FundraiserPageRepository } from 'src/fundraiser-page/repo/fundraiser-page.repository';
import { DonationRepository } from 'src/donation/repo/donation.repository';
import { FindDonationsDto } from './dto/find-donation.dto';
import { FindOptionsWhere } from 'typeorm';
import { Donation } from 'src/donation/entities/donation.entity';

@Injectable()
export class FundraiserService {

    constructor(private fundRaiserRepository:FundRaiserRepository,
      private fundraiserPageRepository:FundraiserPageRepository,
      private donationRepository:DonationRepository){}
    
    findFundRaiserByEmail(email: string) {
        return this.fundRaiserRepository.findOne({where: {email: email}});
      }

    async getFundRaiserStatusByEmail(email: string) {
        var fundraiser = await this.fundRaiserRepository.findOne({where: {email: email}});
        return fundraiser.status;
    }  

    async changePassword(req,changePasswordDto:ChangePasswordDto){
        const fundraiser:Fundraiser = req.user;
        const fundraiser2 = await this.fundRaiserRepository.findOne({where:{email:fundraiser.email},select:["password","fundraiser_id"]})
        var isSame = await bcrypt.compare(changePasswordDto.oldPassword,fundraiser2.password)
        if(isSame){
          if(changePasswordDto.newPassword==changePasswordDto.confirmPassword){
            const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword,10)
            return this.fundRaiserRepository.update(fundraiser2.fundraiser_id,{password:hashedPassword});
          }
          else{
            throw new UnauthorizedException("New password and confirm password do not match")
          }
      }else{
        throw new UnauthorizedException("Old password is incorrect")
      }
      }

    async updateFundRaiserById(req,updateFundRaiserDto:UpdateFundraiserDto){
      // const user:User = req.user;
      console.log(updateFundRaiserDto)
      const fundRaiser = await this.fundRaiserRepository.findOne({where:{fundraiser_id:req.user.id}})
      const updatedFund = await this.fundRaiserRepository.update(fundRaiser.fundraiser_id,updateFundRaiserDto  
        // firstName:fundraiser.firstName,
        // lastName:fundraiser.lastName,
        // mobile_number:fundraiser.mobile_number,
        // profilePicture:fundraiser.profilePicture,
        // address:fundraiser.address,
        // city:fundraiser.city,
        // state:fundraiser.state,
        // country:fundraiser.country,
        // pincode:fundraiser.pincode,
        // dob:fundraiser.dob,
        // pan:fundraiser.pan,
      )

      // console.log(updatedFund)

    }  

    async getFundraiserPage(fundraiser){
      return await this.fundraiserPageRepository.findOne({where:{fundraiser:{fundraiser_id:fundraiser.fundraiser_id}}})
    }
    
    async getDonationByIdFundraiser(user){
      const fundRaiser = await this.findFundRaiserByEmail(user.email)
      const donation = await this.donationRepository.find({where:{fundraiser:{fundraiser_id:fundRaiser.fundraiser_id}}})
      return donation;
    }

    async findMany(dto:FindDonationsDto){
      const {payment_option,payment_status,donation_id,from_date,to_date} = dto;
      let conditions: FindOptionsWhere<Donation> | FindOptionsWhere<Donation>[]= {      }
      conditions = {
        ...conditions,
        payment_type:payment_option,
        payment_status:payment_status,
        donation_id:donation_id,  
      }
      console.log(conditions)
      return await this.donationRepository.find({
        where:conditions
      })
    }
    
}
