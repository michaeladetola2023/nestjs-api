import { Controller,UseGuards, Get, Post, Patch, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { brotliDecompressSync } from 'zlib';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) {}


    @Get()
    getBookmarks(@GetUser('id') userId) {
        return this.bookmarkService.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId,@Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmarkById(userId,bookmarkId);
    }

    @Post()
    createBookmark(@GetUser() userId,@Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId,dto);
    }

    @Patch(':id')
    editBookmarkById(@GetUser() userId,@Param('id', ParseIntPipe) bookmarkId: number,@Body() dto: EditBookmarkDto) {
        return this.bookmarkService.editBookmarkById(userId,dto);
    }

    @Delete(':id')
    deleteBookmarkById(@GetUser() userId,@Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmarkById(userId,bookmarkId);
    }
}
