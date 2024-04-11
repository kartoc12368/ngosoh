import { Body, Injectable, NotFoundException, Req } from '@nestjs/common';
import { Donation } from 'src/donation/entities/donation.entity';
import { DataSource } from 'typeorm';
import { FundraiserPage } from './entities/fundraiser-page.entity';
import { FundraiserPageRepository } from './repo/fundraiser-page.repository';
import { Fundraiser } from 'src/fundraiser/entities/fundraiser.entity';
import { FundRaiserRepository } from 'src/fundraiser/repo/fundraiser.repository';
import { DonationRepository } from 'src/donation/repo/donation.repository';

@Injectable()
export class FundraiserPageService {

    constructor(private dataSource:DataSource,
        private fundRaiserPageRepository:FundraiserPageRepository,
        private fundRaiserRepository:FundRaiserRepository,
        ){}

    async update(body,files,PageId){
        try {

        //finding fundraiserPage using id from parmameters and updating data using body data 
        let fundRaiserPageNew = await this.fundRaiserPageRepository.findOne({where:{id:PageId}})
        console.log(fundRaiserPageNew)
        await this.fundRaiserPageRepository.update(PageId,body) 

        //accessing existing galley of fundraiserPage and pushing new uploaded files
        const fundraiserGallery = fundRaiserPageNew.gallery
        for(let i = 0; i <files.length; i++){
            fundraiserGallery.push(files[i])
        }
        console.log(fundraiserGallery)


        //saving new data of fundraiserPage with gallery
        await this.fundRaiserPageRepository.update(PageId,{gallery:fundraiserGallery}) 

    } catch (error) {
        console.log(error)
        throw new NotFoundException("Not Found")
    }

    }
    
//     async updateRaisedAmount(){
//         let raised_amount = 0;
//         const firstUser = await this.dataSource
//     .getRepository(Donation)
//     .createQueryBuilder("donation")
//     .leftJoinAndSelect("donation.fundraiser","fundraiser")
//     .where("donation.donation_id = :id", { id: 20 })
//     .getOne()
// console.log(firstUser)
//     }
}
