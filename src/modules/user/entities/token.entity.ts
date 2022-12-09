import { File } from 'src/modules/file/entities';
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './user.entity';

@Entity()
export class Token {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: false, unique: true})
    token: string;

    @ManyToOne(type => User, user => user.tokens)
    user: User;
    
    @CreateDateColumn({ type: 'timestamp', name: 'created_at'})
    createdAt: Date;
    
}