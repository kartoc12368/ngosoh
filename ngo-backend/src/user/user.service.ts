import { BadRequestException, Body, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repo/user.repository';
import { User } from './entities/user.entity';
import { Constants } from 'src/utils/constants';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';
import { FundRaiserRepository } from '../fundraiser/repo/fundraiser.repository';
import { Fundraiser } from '../fundraiser/entities/fundraiser.entity';
import { ChangePasswordDto } from '../fundraiser/dto/change-password.dto';
import * as path from 'path';
import { diskStorage } from "multer"
import {v4 as uuidv4} from "uuid";
import { DonationRepository } from 'src/donation/repo/donation.repository';

export const storage =   {  storage:diskStorage({
  destination:"./uploads/profileImages",
  filename:(req,file,cb)=>{
    const filename:string = path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4();
    const extension:string = path.parse(file.originalname).ext;

    cb(null, `${filename}${extension}`)
  } 
})
}


@Injectable()
export class UserService {

  constructor(private userRepository: UserRepository,
    private readonly donationRepository:DonationRepository){}


  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password,10)
    let user: User = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = hashedPassword;
    user.role = Constants.ROLES.NORMAL_ROLE;
    // user.createdAt = DateTime
    return this.userRepository.save(user);
  }
  
  
  findAll() {
    return this.userRepository.find()
  }

  findUserById(id:number){
    return this.userRepository.findOneOrFail({where:{id:id}});
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({where: {email: email}});
  }


  async remove(id: number) {
    const user = await this.userRepository.findOne({where:{id:id}});

    if (!user) {
      throw new NotFoundException('Fundraiser not found');
    }

    return this.userRepository.delete(id);
  }

  async getDonationByIdFundraiser(user){
    const donation = await this.donationRepository.find({where:{user:{id:user.id}}})
    return donation;

  }

}
