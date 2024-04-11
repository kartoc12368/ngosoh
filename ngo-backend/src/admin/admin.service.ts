import {Injectable, NotFoundException } from '@nestjs/common';
import { Fundraiser } from 'src/fundraiser/entities/fundraiser.entity';
import * as bcrypt from 'bcrypt';
import { Constants } from 'src/utils/constants';
import { FundRaiserRepository } from 'src/fundraiser/repo/fundraiser.repository';
import { DonationRepository } from 'src/donation/repo/donation.repository';
import { Donation } from 'src/donation/entities/donation.entity';
import { FundraiserPageRepository } from 'src/fundraiser-page/repo/fundraiser-page.repository';

@Injectable()
export class AdminService {

    constructor(
        private fundraiserRepository:FundRaiserRepository,
        private donationRepository:DonationRepository,
        private fundraiserPageRepository:FundraiserPageRepository){}

    async createdByAdmin(createUserDto:any, password:string){
        const hashedPassword = await bcrypt.hash(password,10)
        let fundraiser: Fundraiser = new Fundraiser();
        fundraiser.firstName = createUserDto.firstName;
        fundraiser.lastName = createUserDto.lastName;
        fundraiser.email = createUserDto.email;
        fundraiser.password = hashedPassword;
        fundraiser.role = Constants.ROLES.FUNDRAISER_ROLE;
        fundraiser.status = "active";
        return await this.fundraiserRepository.save(fundraiser)

        // user.user = user1; 
        // console.log(user1)
        // user.status = "active";
        // return this.fundraiserRepository.save(user);
      
    }

    async changeFundraiserStatus(id:number){
        // return await this.fundraiserRepository.update(id,{status:"inactive"});
        const fundraiser = await this.fundraiserRepository.findOne({where:{fundraiser_id:id}});

        if (!fundraiser) {
          throw new NotFoundException('Fundraiser not found');
        }
      
        // Toggle the status based on its current value
        fundraiser.status = fundraiser.status === 'active' ? 'inactive' : 'active';
      
        // Save the updated fundraiser
        await this.fundraiserRepository.update(id,{status:fundraiser.status});

        return `Status changed to ${fundraiser.status}`;
      
    }  
    
    async deleteFundraiser(id:number){
        const fundraiser = await this.fundraiserRepository.findOne({where:{fundraiser_id:id}});

        if (!fundraiser) {
          throw new NotFoundException('Fundraiser not found');
        }

        return await this.fundraiserRepository.delete(id);
    }

    async getAllFundraiser(){

        const fundraisers = await this.fundraiserRepository.find();
        const filteredUsers = fundraisers.filter((fundraiser) => fundraiser.role !== 'ADMIN');
        return filteredUsers;

    }

    async addOfflineDonation(body){

      //same code from donate service here admin passes data in body
      let donation:Donation = new Donation();
      let fundraiserPage = await this.fundraiserPageRepository.findOne({where:{id:body.fundraiserPage_id}})
      let supportersOfFundraiser = fundraiserPage.supporters
      if(supportersOfFundraiser == null){
        supportersOfFundraiser = []
      }
        supportersOfFundraiser.push(body.Name)
        console.log(supportersOfFundraiser)
      let fundraiser:Fundraiser = await this.fundraiserRepository.findOne({where:{fundraiser_id:fundraiserPage.fundraiser.fundraiser_id}})
      if(fundraiser.fundraiser_id==body.fundraiser_id){
      const total_amount_raised = fundraiser.total_amount_raised + parseInt(body.amount);
      const total_donations = fundraiser.total_donations + 1;
      await this.fundraiserRepository.update(fundraiser.fundraiser_id,{total_amount_raised:total_amount_raised,
      total_donations:total_donations})
      const newAmount:number = fundraiserPage.raised_amount + parseInt(body.amount);
      await this.fundraiserPageRepository.update(body.fundraiserPage_id,{ raised_amount:newAmount,supporters:supportersOfFundraiser})
      }
      else{
        return "Fundraiser Page Not Found"
      }
      if(fundraiser.status == "active"){
        donation.fundraiser = fundraiser;
        donation.amount = body.amount;
        donation.Name = body.Name;
        return this.donationRepository.save(donation);  
      }
      else{
        return "Fundraiser not active";
      }



    }
}
