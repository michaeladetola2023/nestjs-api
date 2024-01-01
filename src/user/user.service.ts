import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async editUser(userId, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId.id,
            },
            data: {
                ...dto,
            }
        });

        delete user.password;
        return user;
    }
}
