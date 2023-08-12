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
import { Track } from '../../interfaces/track.interface';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  async getAll(): Promise<Track[]> {
    return this.trackService.getAll();
  }

  @Get(':id')
  async getSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Track> {
    return this.trackService.get(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(@Body() data: CreateTrackDto): Promise<Track> {
    return this.trackService.create(data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateTrackDto,
  ): Promise<Track> {
    return this.trackService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    return this.trackService.delete(id);
  }
}
