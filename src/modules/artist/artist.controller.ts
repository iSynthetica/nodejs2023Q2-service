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
import { Artist } from '../../interfaces/artist.interface';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavoriteService } from '../favorite/favorite.service';

@Controller('artist')
export class ArtistController {
  constructor(
    private artistService: ArtistService,
    private readonly favoriteService: FavoriteService,
  ) {}
  @Get()
  async getAll(): Promise<Artist[]> {
    return this.artistService.getAll();
  }

  @Get(':id')
  async getSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Artist> {
    return this.artistService.get(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(@Body() data: CreateArtistDto): Promise<Artist> {
    return this.artistService.create(data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateArtistDto,
  ): Promise<Artist> {
    return this.artistService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    const result = await this.artistService.delete(id);
    await this.favoriteService.remove(id, 'artists').catch(() => true);
    return result;
  }
}
