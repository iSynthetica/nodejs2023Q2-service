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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { TrackEntity } from './entity/track.entity';

@Controller('track')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Get()
  async getAll(): Promise<TrackEntity[]> {
    return this.trackService.getAll();
  }

  @Get(':id')
  async getSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TrackEntity> {
    return this.trackService.get(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(@Body() data: CreateTrackDto): Promise<TrackEntity> {
    return this.trackService.create(data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateTrackDto,
  ): Promise<TrackEntity> {
    return this.trackService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    const result = await this.trackService.delete(id);
    await this.favoriteService.remove(id, 'tracks').catch(() => true);
    return result;
  }
}
