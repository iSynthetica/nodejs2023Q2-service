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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistEntity } from './entity/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(
    private artistService: ArtistService,
    private readonly trackService: TrackService,
    private readonly favoriteService: FavoriteService,
    private readonly albumService: AlbumService,
  ) {}
  @Get()
  async getAll(): Promise<ArtistEntity[]> {
    return this.artistService.getAll();
  }

  @Get(':id')
  async getSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ArtistEntity> {
    return this.artistService.get(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(@Body() data: CreateArtistDto): Promise<ArtistEntity> {
    return this.artistService.create(data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    return this.artistService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    const result = await this.artistService.delete(id);
    await this.favoriteService.remove(id, 'artists').catch(() => true);
    let [albums, tracks] = await Promise.all([
      this.albumService.getAll(),
      this.trackService.getAll(),
    ]);
    tracks = tracks.filter((track) => track.artistId === id);
    albums = albums.filter((album) => album.artistId === id);

    if (tracks.length) {
      const promises = [];

      for (const track of tracks) {
        promises.push(this.trackService.update(track.id, { artistId: null }));
      }

      await Promise.all(promises);
    }

    if (albums.length) {
      const promises = [];

      for (const album of albums) {
        promises.push(this.albumService.update(album.id, { artistId: null }));
      }

      await Promise.all(promises);
    }

    return result;
  }
}
