import { File } from 'src/modules/file/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Token } from './token.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'first_name', nullable: false })
    firstName: string;

    @Column({ name: 'last_name', nullable: false })
    lastName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @OneToMany(type => File, file => file.user)
    files: File[];

    @OneToMany(type => Token, token => token.user)
    tokens: Token[];
    
    @BeforeInsert()
    async setPassword(password: string): Promise<void> {
        //const salt: string = await bcrypt.genSalt();
        this.password = await bcrypt.hash(password || this.password, 10);
    }
}