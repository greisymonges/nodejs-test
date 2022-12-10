import { User } from "src/modules/user/entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { fileURLToPath } from "url";

@Entity()
export class File {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({ name: 'aws_id', nullable: false })
    awsId: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    url: string;

    @ManyToOne(type => User, user => user.files, { cascade: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}