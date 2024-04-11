import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Fundraiser } from "../../fundraiser/entities/fundraiser.entity";
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

    @ManyToOne(()=>Fundraiser,fundraiser=>fundraiser.donations,{onDelete:"SET NULL"})
    fundraiser:Fundraiser;


}
