import { Field } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Donation } from "../../donation/entities/donation.entity";
import { User } from "src/user/entities/user.entity";
import { Project } from "src/project/entities/project.entity";
import { IsNumber } from "class-validator";
import { FundraiserPage } from "src/fundraiser-page/entities/fundraiser-page.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Fundraiser {

    @PrimaryGeneratedColumn()
    @OneToOne(()=> User,(id)=>{id.id})
    fundraiser_id: number;

    @Column()
    firstName: string;

    @Column({
        nullable: true
    })
    lastName: string;

    @Column({unique:true})
    email: string;

    @Column({select:false})
    password: string;

    @Column()
    role: string;

    @Column({
    })
    status:string

    @IsNumber()
    @Column({nullable:true})
    mobile_number:number

    // @Column('text',{array: true,nullable:true})
    // profilePicture:string[];

    @Column({nullable:true})
    address:string

    @Column({nullable:true})
    city:string

    @Column({nullable:true})
    profileImage: string;

    @Column({nullable:true})
    state:string

    @Column({nullable:true})
    country:string

    @Column({nullable:true})
    pincode:number

    @Column({nullable:true})
    dob:Date

    @Column({nullable:true})
    pan:string

    @Column({default:0})
    total_amount_raised:number;

    @Column({default:0})
    total_donations:number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;


    @OneToOne(()=>User,user=>user.fundraiser)
    user:User

    @OneToMany(()=>Donation,donation=>donation.fundraiser)
    donations:Donation[];

    @ManyToMany(()=>Project,project=>project.fundraiser)
    @JoinTable()
    project:Project[]

    @OneToMany(()=>FundraiserPage,fundraiserPage=>fundraiserPage.fundraiser)
    fundraiser_page:FundraiserPage[];

}
