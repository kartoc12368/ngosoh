import { Fundraiser } from "src/fundraiser/entities/fundraiser.entity";
import { Project } from "src/project/entities/project.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()

export class FundraiserPage{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:0})
    target_amount:number;

    @Column({default:0})
    raised_amount:number;

    @Column({nullable:true})
    resolution:string;

    @Column({nullable:true})
    about:string;

    @Column({nullable:true})
    money_raised_for:string;

    @Column('text',{array: true,nullable:true})
    supporters:string[];

    @Column('text',{array: true,nullable:true})
    gallery:string[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @ManyToOne(()=>Fundraiser,fundraiser=>fundraiser.fundraiser_page,{onDelete:"CASCADE",eager:true})
    fundraiser:Fundraiser;

    @ManyToOne(()=>Project,project=>project.fundraiserPage,{onDelete:"SET NULL"})
    project:Project;

}