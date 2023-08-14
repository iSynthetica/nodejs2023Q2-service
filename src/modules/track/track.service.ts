import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './entity/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  @Inject(ArtistService)
  private readonly artistService: ArtistService;

  @Inject(AlbumService)
  private readonly albumService: AlbumService;

  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async getAll(): Promise<TrackEntity[]> {
    return await this.trackRepository.find();
  }

  async get(id: string): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) this.notFound();

    return track;
  }

  async create(data: CreateTrackDto): Promise<TrackEntity> {
    let artist = null;
    let album = null;

    if (data.artistId) artist = await this.artistService.get(data.artistId);
    else data.artistId = null;
    if (data.albumId) album = await this.albumService.get(data.albumId);
    else data.albumId = null;

    if (artist && album && artist.id !== album.artistId) {
      throw new BadRequestException("Album doesn't belong to the artist");
    }

    const newTrack = this.trackRepository.create({ ...data });
    return await this.trackRepository.save(newTrack);
  }

  async update(id: string, data: UpdateTrackDto): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) this.notFound();

    const updatedTrack: Partial<TrackEntity> = {};
    if (data.name) updatedTrack.name = data.name;
    if (data.duration) updatedTrack.duration = data.duration;
    if (data.artistId !== undefined) updatedTrack.artistId = data.artistId;
    if (data.albumId !== undefined) updatedTrack.albumId = data.albumId;

    await this.trackRepository.update(id, updatedTrack);
    return await this.trackRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) this.notFound();
    await this.trackRepository.delete(id);
    return true;
  }

  private notFound() {
    throw new NotFoundException('Track not found');
  }
}
