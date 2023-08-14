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
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { TrackService } from '../track/track.service';
import { AlbumEntity } from './entity/album.entity';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Get()
  async getAll(): Promise<AlbumEntity[]> {
    return this.albumService.getAll();
  }

  @Get(':id')
  async getSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AlbumEntity> {
    return this.albumService.get(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(@Body() data: CreateAlbumDto): Promise<AlbumEntity> {
    return this.albumService.create(data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    return this.albumService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    const result = await this.albumService.delete(id);
    await this.favoriteService.remove(id, 'albums').catch(() => true);
    let tracks = await this.trackService.getAll();
    tracks = tracks.filter((track) => track.albumId === id);

    if (tracks.length) {
      const promises = [];

      for (const track of tracks) {
        promises.push(this.trackService.update(track.id, { albumId: null }));
      }

      await Promise.all(promises);
    }

    return result;
  }
}
