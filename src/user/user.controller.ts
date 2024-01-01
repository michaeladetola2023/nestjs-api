import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';


@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    
    @Get('me')
    //@GetUser() z my custom request param i crated.
    getMe(@GetUser() user: User) {
        return user;
    }

    @Patch()
    editUser(@Req() req,@GetUser() userId,@Body() dto: EditUserDto ) {
        return this.userService.editUser(userId,dto);
    }

}
