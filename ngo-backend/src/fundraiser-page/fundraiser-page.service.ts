import { Body, Injectable, NotFoundException, Req } from '@nestjs/common';
import { Donation } from 'src/donation/entities/donation.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { FundraiserPage } from './entities/fundraiser-page.entity';
import { FundraiserPageRepository } from './repo/fundraiser-page.repository';
import { Fundraiser } from 'src/fundraiser/entities/fundraiser.entity';
import { FundRaiserRepository } from 'src/fundraiser/repo/fundraiser.repository';
import { DonationRepository } from 'src/donation/repo/donation.repository';
import { ProjectService } from 'src/project/project.service';
import { Project } from 'src/project/entities/project.entity';
import { ProjectRepository } from 'src/project/repo/project.repository';

@Injectable()
export class FundraiserPageService {

    constructor(private dataSource:DataSource,
        private fundRaiserPageRepository:FundraiserPageRepository,
        private fundRaiserRepository:FundRaiserRepository,
        private projectRepository:ProjectRepository
        ){}

    async update(body,files,PageId,project_name,user){
        try {

        //finding fundraiserPage using id from parmameters and updating data using body data 
        let fundRaiserPageNew = await this.fundRaiserPageRepository.find({where:{id:PageId}})
        await this.fundRaiserPageRepository.update(PageId,body) 

        //accessing existing galley of fundraiserPage and pushing new uploaded files
        const fundraiserGallery = fundRaiserPageNew[0].gallery
        for(let i = 0; i <files.length; i++){
            fundraiserGallery.push(files[i])
        }

        //finding Project using project_name from body to update project id in fundraiser page
        const project:Project= await this.projectRepository.findOne({where:{project_name:project_name}})
        let fundraiser:Fundraiser = await this.fundRaiserRepository.findOne({where:{email:user.email}})
        
        //accessing existing fundraiser in project and pushing new fundraiser 
        let fundRaiser = project.fundraiser
        fundRaiser.push(fundraiser)
        project.fundraiser = fundRaiser
        
        //saving new fundraiser in project
        const temp = await this.projectRepository.save(project)

        //saving new data of fundraiserPage with gallery and project
        await this.fundRaiserPageRepository.update(PageId,{gallery:fundraiserGallery,project:project}) 
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
