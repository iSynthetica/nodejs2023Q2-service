import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from 'src/interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAll(): Promise<Album[]> {
    return this.albumService.getAll();
  }

  @Get(':id')
  async getSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Album> {
    return this.albumService.get(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(@Body() data: CreateAlbumDto): Promise<Album> {
    return this.albumService.create(data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    return this.albumService.delete(id);
  }
}
