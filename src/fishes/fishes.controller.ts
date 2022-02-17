import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { FishesService } from './fishes.service';
import { CreateFishDto } from './dto/create-fish.dto';
import { UpdateFishDto } from './dto/update-fish.dto';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultiFileUpload } from 'src/file/custom-file.interceptor';
import { GoogleFileUploadDto } from 'src/file/dto/create-file.dto';
import { FileService } from 'src/file/file.service';
import { GetFishDto } from './dto/get-fish.dto';

@ApiTags('Fish')
@Controller('fishes')
export class FishesController {
  constructor(
    private readonly fishesService: FishesService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @MultiFileUpload('files', true)
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createFishDto: CreateFishDto,
    @UploadedFiles() files: GoogleFileUploadDto[],
  ) {
    const uploadedFiles = await this.fileService.createMany(files);
    return this.fishesService.create({
      ...createFishDto,
      files: uploadedFiles,
    });
  }

  @Get()
  @ApiResponse({
    isArray: true,
    type: GetFishDto,
  })
  findAll() {
    return this.fishesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    type: () => GetFishDto,
  })
  findOne(@Param('id') id: string) {
    return this.fishesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFishDto: UpdateFishDto) {
    return this.fishesService.update(+id, updateFishDto);
  }

  @Delete(':id')
  @ApiResponse({
    type: () => GetFishDto,
  })
  remove(@Param('id') id: string) {
    return this.fishesService.remove(+id);
  }
}
