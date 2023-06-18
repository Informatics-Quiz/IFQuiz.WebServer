import { Query, Body, Controller, Get,Header,Post, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import * as path from 'path';
import { FileService } from './file.service';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UploadQuizCoverImageDto } from './dto/quiz-image.dto';

import { Query as ExpressQuery } from 'express-serve-static-core'


@Controller('file')
export class FileController {
    constructor(private fileService: FileService) { }

    @Post('/upload/profile-image')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('profile-image', {
        storage: diskStorage({
            destination: 'resources/profile-image',
            filename: (req, file, cb) => {
                const filename = uuidv4()
                const ext = path.parse(file.originalname).ext
                cb(null, `${filename}${ext}`)
            },
        }), 
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|png|jpeg|gif)$/))
                cb(null, true);
            else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        },
        limits: {fileSize: 4e+6},
    }))
    async uploadProfileImage(
        @Req()
        req,
        @UploadedFile()
        file: Express.Multer.File
    ) {
        return {
            imageUrl: await this.fileService.updateProfileImage(req.user._id, file.filename)
        }
    }

    @Get('/get/profile-image')
    @UseGuards(AuthGuard())
    getProfileImage(
        @Req() req,
        @Res({ passthrough: true }) res
    ): StreamableFile {
        if(!req.user.imageUrl){
            res.status(200)
            return 
        }
        const file = createReadStream(join(process.cwd(), './resources/profile-image/' + req.user.imageUrl));
        const fileType = req.user.imageUrl.match(/\.([^.]+)$/)[1];
        res.set({
            'Content-Type': `image/${fileType}`,
            'Content-Disposition': `attachment; filename="${req.user.imageUrl}"`,
        })
        return new StreamableFile(file);
        // return res.sendFile(req.user.imageUrl, {root: './resources/profile-image'})
        // return res.sendFile(join(process.cwd(), './resources/profile-image/' + req.user.imageUrl))
    }

    @Get('/get/quiz-cover-image')
    getQuizCoverImage(
        @Query()
        query: ExpressQuery,
        @Res({ passthrough: true }) 
        res
    ): StreamableFile {
        const imageUrl = query.imageUrl as string
        if(!imageUrl){
            res.status(200)
            return 
        }
        try {
            const file = createReadStream(join(process.cwd(), './resources/quiz-cover-image/' + imageUrl));
            const fileType = imageUrl.match(/\.([^.]+)$/)[1];
            res.set({
                'Content-Type': `image/${fileType}`,
                'Content-Disposition': `attachment; filename="${imageUrl}"`,
            })
            return new StreamableFile(file);

        }catch(e) {
            const file = createReadStream(join(process.cwd(), './resources/static-image/image.png'));
            const fileType = imageUrl.match(/\.([^.]+)$/)[1];
            res.set({
                'Content-Type': `image/${fileType}`,
                'Content-Disposition': `attachment; filename="${imageUrl}"`,
            })
            return new StreamableFile(file);
        }
    }
    

    @Post('/upload/quiz-cover-image')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('quiz-cover-image', {
        storage: diskStorage({
            destination: 'resources/quiz-cover-image',
            filename: (req, file, cb) => {
                const filename = uuidv4()
                const ext = path.parse(file.originalname).ext
                cb(null, `${filename}${ext}`)
            },
        }), 
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|png|jpeg|gif)$/))
                cb(null, true);
            else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        },
        limits: {fileSize: 4e+6},
    }))
    async uploadQuizCoverImage(
        @Req()
        req,
        @UploadedFile()
        file: Express.Multer.File,
        @Body()
        body: UploadQuizCoverImageDto
    ) {
        return {
            imageUrl: await this.fileService.uploadQuizCoverImage(req.user._id, body.quizId, file.filename)
        }
    }

}
