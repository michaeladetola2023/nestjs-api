import { Body, Controller, Post, Req,HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, AuthRrgDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    //@HttpCode(200) OR @HttpCode(StatusCode.OK)
    @Post('register')
    signup(@Body() dto: AuthRrgDto) {
        return this.authService.signup(dto);
    }
    

    @Post('login') 
    signin(@Body() dto: AuthDto): any {
        console.log(dto);
        return this.authService.login(dto);
    }
}
