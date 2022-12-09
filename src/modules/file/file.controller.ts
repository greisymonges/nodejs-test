import { Controller, Get, HttpCode, HttpStatus, Patch, Post, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth';
import { PaginationQueryDto } from './dto';

import { File } from './entities';
import { FileService } from './file.service';

@Controller('files')
export class FileController {

    constructor(private readonly fileService: FileService) {

    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getFiles(@Query() pagination: PaginationQueryDto): Promise<File[]> {
        return this.fileService.get(pagination);
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    getFilesByUser(@Param('userId') userId: number, @Query() pagination: PaginationQueryDto): Promise<File[]> {
        return this.fileService.getByUser(userId, pagination);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    downloadFile(): string {
        return 'Not Implemented';
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    uploadFile(): string {
        return 'Not Implemented.';
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    renameFile(): string {
        return 'Not Implemented';
    }

}
