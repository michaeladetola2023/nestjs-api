import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, AuthRrgDto } from './dto';







@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
        ) {}

    async login(dto: AuthDto) {

        //find the user by email
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            }
        });

        //throwing exeption error if user does not exist
        if (!user) throw new ForbiddenException("Credentials Incorrect!"); 

        //comparing the password
        const pwMatches = await argon.verify(user.password,dto.password);
        if (!pwMatches) throw new ForbiddenException("Incorrect Password!"); 

        //returning existing user

        //sign the user account to jwt web token
        return this.signToken(user.id,user.email);
    }

    async signup(dto: AuthRrgDto) {

        try {

            //generate hash password
        const hash = await argon.hash(dto.password);
        dto.password = hash;

        //save the new user to DB
        const user = await this.prisma.user.create({
            data: {
                ...dto,
            }
        });

        

        //sign the user account to jwt web token
        return this.signToken(user.id,user.email);

        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential Taken!');
                }
            }

            throw error;
        }
        
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email,
        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
            expiresIn: '15m',
            secret: secret,
            }
        );

        return {access_token: token}
    }
}
