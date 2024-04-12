import { Column, CreateDateColumn, Entity,ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Fundraiser } from "../../fundraiser/entities/fundraiser.entity";

export enum PaymentRole {
    OFFLINE = "offline",
    ONLINE = "online",
}

export enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
}


@Entity()
export class Donation {

    @PrimaryGeneratedColumn("uuid")
    donation_id: string;

    @Column()
    amount: number;

    @Column({nullable:true})
    donor_name: string;

    @Column({nullable: true})
    pan:string;

    @Column({nullable: true})
    donor_email: string;

    @Column({nullable:true})
    donor_phone: number;

    @Column({nullable: true})
    donor_address: string;

    @Column({nullable: true})
    comments:string;

    @Column({nullable: true,type:"enum",enum:PaymentRole,default:PaymentRole.ONLINE})
    payment_type: string;

    @Column({nullable: true,type:"enum",enum:PaymentStatus,default:PaymentStatus.SUCCESS})
    payment_status: string;

    @Column({nullable: true})
    certificate:string;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @ManyToOne(()=>Fundraiser,fundraiser=>fundraiser.donations,{onDelete:"SET NULL"})
    fundraiser:Fundraiser;


}
