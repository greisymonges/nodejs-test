import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { Response } from 'express';
import { JwtAuthGuard, LocalAuthGuard, RequestUser } from 'src/common/auth';
import { ForgetPasswordDto, ResetPasswordDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    
    constructor(private readonly userService: UserService) {

    }

    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() request: RequestUser) {
        const user = request.user;
        return user;
    }

    @Post()
    create(@Body() user: CreateUserDto): Promise<User> {
        return this.userService.create(user);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() request: RequestUser, @Res() response: Response) {
        const {user} = request;
        const cookie = this.userService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        return response.send(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logOut(@Req() request: RequestUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.userService.getCookieForLogOut());
        return response.sendStatus(HttpStatus.OK);
    }

    @Get('/forget-pwd')
    forgetPassword(@Body() user: ForgetPasswordDto): Promise<void> {
        return this.userService.forgetPassword(user);
    }

    @Patch('/reset-pwd')
    resetPassword(@Body() user: ResetPasswordDto): Promise<void> {
        return this.userService.resetPassword(user); 
    }
}
