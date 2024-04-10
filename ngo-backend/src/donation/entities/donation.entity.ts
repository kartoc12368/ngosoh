import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Fundraiser } from "../../fundraiser/entities/fundraiser.entity";
import { User } from "src/user/entities/user.entity";
import { Project } from "src/project/entities/project.entity";

@Entity()
export class Donation {

    @PrimaryGeneratedColumn()
    donation_id: number;

    @Column()
    amount: number;

    @Column({nullable: true})
    Name: string;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @ManyToOne(()=>User,user=>user.donations,{onDelete:"SET NULL"})
    user:User

    @ManyToOne(()=>Fundraiser,fundraiser=>fundraiser.donations,{onDelete:"SET NULL"})
    fundraiser:Fundraiser;

    @ManyToOne(()=>Project,project=>project.donations,{onDelete:"SET NULL"})
    project:Project;

}
