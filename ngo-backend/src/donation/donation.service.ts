import { Injectable, NotFoundException } from '@nestjs/common';
import { DonationRepository } from './repo/donation.repository';
import { User } from 'src/user/entities/user.entity';
import { Fundraiser } from 'src/fundraiser/entities/fundraiser.entity';
import { FundraiserService } from 'src/fundraiser/fundraiser.service';
import { Donation } from './entities/donation.entity';
import { FundRaiserRepository } from 'src/fundraiser/repo/fundraiser.repository';
import { first } from 'rxjs';
import { FundraiserPageRepository } from 'src/fundraiser-page/repo/fundraiser-page.repository';

@Injectable()
export class DonationService {
    constructor(private donationRepository: DonationRepository,
        private readonly fundRaiserRepository:FundRaiserRepository,
        private readonly fundRaiserPageRepository:FundraiserPageRepository){}

    async donate(req,body,id?){
        //getting logged user if any
        let user:User = req.user;

        //making a new donation object to save
        let donation:Donation = new Donation();

        //creating empty supporter array to push to supporters of fundraiserPage
        let supporters = []

        //checking if user exists then use name from database [validation also exists for undefined last name]
        if(user){
            const {firstName,lastName} = user;
            if(lastName==undefined){
                donation.Name = firstName;
                supporters.push(firstName)
            }
            else{

            donation.Name = firstName + " " + lastName;
            donation.user = user;
            supporters.push(firstName + " " + lastName)
            }
        }
        else{
            donation.Name = body.name;
            supporters.push(body.name)
        }

        //getting fundraiserPage using id from params if any
        try{
            if(id){
            let fundraiserPage = await this.fundRaiserPageRepository.findOne({where:{id:id}})
            
            //getting existing fundraiserPage supporters anf pushing new supporters
            let supportersOfFundraiser = fundraiserPage.supporters
            for(let i = 0; i <supporters.length; i++){
                supportersOfFundraiser.push(supporters[i])
            }
    
            if(!fundraiserPage){
                throw new NotFoundException("Fundraiser Page not found");
            }
            
            //getting fundraiser to update its dashboard content
            let fundraiser:Fundraiser = await this.fundRaiserRepository.findOne({where:{fundraiser_id:fundraiserPage.fundraiser.fundraiser_id}})
            const total_amount_raised = fundraiser.total_amount_raised + parseInt(body.amount);
            const total_donations = fundraiser.total_donations + 1;
            await this.fundRaiserRepository.update(fundraiser.fundraiser_id,{total_amount_raised:total_amount_raised,
            total_donations:total_donations})

            //getting already raised amount of FundraiserPage and updating amount with supporters
            const newAmount:number = fundraiserPage.raised_amount + parseInt(body.amount);
            await this.fundRaiserPageRepository.update(id,{ raised_amount:newAmount,supporters:supportersOfFundraiser})

            //checking if status is active then only fundraiser data is available in donation database
            if(fundraiser.status == "active"){
                donation.fundraiser = fundraiser;
              }
            }
        }
        //executing a finally block so that no matter what amount saves with name in database
        //[whether user is logged in or not]
        //[whether fundraiser is active or not]
        //[whether fundraiser id is passed or not]
        finally{
        donation.amount = body.amount;

        
        return this.donationRepository.save(donation);
    }
      }
    
}
