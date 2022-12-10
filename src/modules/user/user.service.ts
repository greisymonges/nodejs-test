import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { ForgetPasswordDto, LoginUserDto, ResetPasswordDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { UserModule } from './user.module';
import { Token } from './entities';
import { EmailService } from '../email/email.service';
import { TokenPayload } from '../../common/auth';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
    ){

    }

    async getById(userId: number): Promise<User> {
        const user: User = await this.userRepository.findOne({
            where: {
                id: userId,
            }
        });

        if (user === null) {
            throw new EntityNotFoundError(User, { id: userId });
        }

        user.password = undefined;

        return user;
    }

    async create({ firstName, lastName, email, username, password, confirm }: CreateUserDto): Promise<User> {
        const u: User = this.userRepository.create({ firstName, lastName, email, username, password });
        return await this.userRepository.save(u);
    }

    async login(loginUserDto: LoginUserDto): Promise<User> {
        const user: User = await this.userRepository.findOne({
            where: {
                username: loginUserDto.username,
            }
        });

        console.log(user);
        
        if (user === null || !(await bcrypt.compare(loginUserDto.password, user.password))) {
            throw new UnauthorizedException('User credentials Invalid.');
        }

        user. password = undefined;

        return user;
    }

    async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
        const user: User = await this.userRepository.findOne({
            where: {
                email: forgetPasswordDto.email,
            }
        });

        if (user === null) {
            throw new EntityNotFoundError(User, { email: forgetPasswordDto.email });
        }

        const t: string = this.getJwtToken(user.id);
        const token: Token = this.tokenRepository.create({
            token: t,
            user: user,
        });

        await this.tokenRepository.save(token);

        await this.emailService.sendResetPassword(user.email, user.firstName, t);

        return;
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
        const token: Token = await this.tokenRepository.findOne({
            select: { token: true },
            where: { token: resetPasswordDto.token }
        });

        if (token === null) {
            throw new EntityNotFoundError(Token, { token: resetPasswordDto.token });
        }

        await this.userRepository.delete({
            id: token.id
        });

        const user: User = await this.validateJwtToken(resetPasswordDto.token);

        if (user === null) {
            throw new EntityNotFoundError(User, { token: resetPasswordDto.token });
        }

        await user.setPassword(resetPasswordDto.password);

        await this.userRepository.save(user);
    }
    
    private getJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        return this.jwtService.sign(payload);
    }

    private async validateJwtToken(token: string): Promise<User> {
        const payload: TokenPayload = this.jwtService.decode(token, { json: true }) as TokenPayload;
        return await this.getById(payload.userId);
    }

    public getCookieWithJwtToken(userId: number) {
        const token = this.getJwtToken(userId);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}
