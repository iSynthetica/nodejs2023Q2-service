import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from '../../interfaces/track.interface';
import { trackDb } from '../../database/track.data';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  private readonly tracks: Track[];

  @Inject(ArtistService)
  private readonly artistService: ArtistService;

  @Inject(AlbumService)
  private readonly albumService: AlbumService;

  constructor() {
    this.tracks = trackDb;
  }

  async getAll(): Promise<Track[]> {
    return this.tracks;
  }

  async get(id: string): Promise<Track> {
    const returnTrack = this.tracks.find((track) => track.id === id);
    if (!returnTrack) this.notFound();

    return returnTrack;
  }

  async create(data: CreateTrackDto): Promise<Track> {
    const [artist, album] = await Promise.all([
      this.artistService.get(data.artistId),
      this.albumService.get(data.albumId),
    ]);

    if (artist.id !== album.artistId) {
      throw new BadRequestException("Album doesn't belong to the artist");
    }

    const newTrack: Track = { id: uuidv4(), ...data };
    this.tracks.push(newTrack);

    return newTrack;
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    const updatedTrack = this.tracks.find((track) => track.id === id);

    if (!updatedTrack) this.notFound();

    if (data.name) updatedTrack.name = data.name;
    if (data.duration) updatedTrack.duration = data.duration;

    return updatedTrack;
  }

  async delete(id: string): Promise<boolean> {
    const trackIdx = this.tracks.findIndex((track) => track.id === id);

    if (trackIdx === -1) this.notFound();

    this.tracks.splice(trackIdx, 1);
    return true;
  }

  private notFound() {
    throw new NotFoundException('Track not found');
  }
}
