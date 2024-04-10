import { Field } from "@nestjs/graphql";
import { Donation } from "src/donation/entities/donation.entity";
import { FundraiserPage } from "src/fundraiser-page/entities/fundraiser-page.entity";
import { Fundraiser } from "src/fundraiser/entities/fundraiser.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    project_id: number;

    @Column({unique:true})
    project_name: string;

    @Column()
    project_description: string;

    @Column('text',{array: true})
    project_images: string[];

    @Column({default:0})
    total_donations:number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @ManyToMany(()=>Fundraiser,fundraiser=>fundraiser.project,{onDelete:"SET NULL",eager:true})
    fundraiser:Fundraiser[];

    @OneToMany(()=>FundraiserPage,fundraiserPage=>fundraiserPage.project,{onDelete:"SET NULL"})
    fundraiserPage:FundraiserPage[];

    @OneToMany(()=>Donation,donation=>donation.project,{onDelete:"SET NULL"})
    donations:Donation[];


}
