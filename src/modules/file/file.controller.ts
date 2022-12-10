import { Controller, Get, HttpCode, HttpStatus, Patch, Post, Param, Query, UseGuards, UseInterceptors, UploadedFile, Req, Res, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, RequestUser } from 'src/common/auth';
import { PaginationQueryDto, UploadFileDto, DowloadFileDto, UpdateFileDto } from './dto';

import { File } from './entities';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('files')
export class FileController {

    constructor(private readonly fileService: FileService) {

    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getFiles(@Query() pagination: PaginationQueryDto): Promise<File[]> {
        return this.fileService.get(pagination);
    }

    @Patch('file')
    @UseGuards(JwtAuthGuard)
    updateFile(@Body() file: UpdateFileDto): Promise<File> {
        return this.fileService.updateFile(file);
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

    @Post('fileAws')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    uploadFileAws(@Req() request: RequestUser, @UploadedFile() file: Express.Multer.File) {
        return this.fileService.uploadFile(request.user.id, file.buffer, { name: file.originalname } as UploadFileDto);
    }

    @Get('fileAws/:id')
    @UseGuards(JwtAuthGuard)
    async dowloadFileAws(
        @Req() request: RequestUser,
        @Param() { id }: DowloadFileDto,
        @Res() res: Response
    ) {
        const file = await this.fileService.dowloadFile(request.user.id, Number(id));
        file.pipe(res);
    }

}
