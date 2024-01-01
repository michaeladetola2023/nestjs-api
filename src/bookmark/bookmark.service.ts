import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';


@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) {}


    getBookmarks(userId) {
        return this.prisma.bookmark.findMany({
            where: {
                userId: userId.id,
            }
        });
    }

    async createBookmark(userId, dto: CreateBookmarkDto) {
        console.log({
            userId,
            info: dto,
        });

        /*const bookmark =  await this.prisma.bookmark.create({
             data: {
                //userId: userId.id,
                ...dto,
             }
        });*/

        //return bookmark;
    }

    getBookmarkById(userId, bookmarkId: number) {}

    editBookmarkById(userId, dto: EditBookmarkDto) {}

    deleteBookmarkById(userId, bookmarkId: number) {}
}
