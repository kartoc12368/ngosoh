import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FundRaiserRepository } from './repo/fundraiser.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Fundraiser } from './entities/fundraiser.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/user/repo/user.repository';
import { User } from 'src/user/entities/user.entity';
import { UpdateFundraiserDto } from './dto/update-profile.dto';
import { time } from 'console';
import { FundraiserPageRepository } from 'src/fundraiser-page/repo/fundraiser-page.repository';
import { DonationRepository } from 'src/donation/repo/donation.repository';

@Injectable()
export class FundraiserService {

    constructor(private fundRaiserRepository:FundRaiserRepository,
      private userRepository:UserRepository,
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
        const user:User = req.user;
        const user2 = await this.userRepository.findOne({where:{email:user.email}})
        var isSame = await bcrypt.compare(changePasswordDto.oldPassword,user2.password)
        if(isSame){
          if(changePasswordDto.newPassword==changePasswordDto.confirmPassword){
            const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword,10)
            return this.userRepository.update(user2.id,{password:hashedPassword});
          }
          else{
            throw new UnauthorizedException("New password and confirm password do not match")
          }
      }else{
        throw new UnauthorizedException("Old password is incorrect")
      }
      }

    async updateFundRaiserById(req,updateFundRaiserDto:UpdateFundraiserDto){
      const user:User = req.user;
      console.log(updateFundRaiserDto)
      const fundRaiser = await this.fundRaiserRepository.findOne({where:{fundraiser_id:req.id}})
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

    async getAllFundraiserPages(fundraiser){
      return await this.fundraiserPageRepository.find({where:{fundraiser:{fundraiser_id:fundraiser.fundraiser_id}}})
    }
    
    async getDonationByIdFundraiser(user){
      const fundRaiser = await this.findFundRaiserByEmail(user.email)
      const donation = await this.donationRepository.find({where:{fundraiser:{fundraiser_id:fundRaiser.fundraiser_id}}})
      return donation;
    }
    
}
