import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '../../interfaces/album.interface';
import { albumDb } from '../../database/album.data';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistService } from '../artist/artist.service';
import { Artist } from 'src/interfaces/artist.interface';

@Injectable()
export class AlbumService {
  private readonly albums: Album[];

  @Inject(ArtistService)
  private readonly artistService: ArtistService;

  constructor() {
    this.albums = albumDb;
  }

  async getAll(): Promise<Album[]> {
    const albums = this.albums;
    const promises = [];

    for (const album of albums) {
      promises.push(this.addArtistName(album));
    }

    await Promise.all(promises);

    return this.albums;
  }

  async get(id: string): Promise<Album> {
    const returnAlbum = this.albums.find((album) => album.id === id);
    if (!returnAlbum) this.notFound();
    await this.addArtistName(returnAlbum);

    return returnAlbum;
  }

  async create(data: CreateAlbumDto): Promise<Album> {
    const artistId = data.artistId;
    await this.artistService.get(artistId);

    const newAlbum: Album = {
      id: uuidv4(),
      ...data,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  async update(id: string, data: UpdateAlbumDto): Promise<Album> {
    const updatedAlbum = this.albums.find((album) => album.id === id);

    if (!updatedAlbum) this.notFound();

    if (data.name) updatedAlbum.name = data.name;
    if (data.year) updatedAlbum.year = data.year;

    return updatedAlbum;
  }

  async delete(id: string): Promise<boolean> {
    const albumIdx = this.albums.findIndex((album) => album.id === id);

    if (albumIdx === -1) this.notFound();

    this.albums.splice(albumIdx, 1);
    return true;
  }

  private async addArtistName(album: Album): Promise<void> {
    try {
    } catch (err: unknown) {
      console.log((err as Error).message);
    }
    const artist: Artist = await this.artistService.get(album.artistId);

    album.artistName = artist.name;
  }

  private notFound() {
    throw new NotFoundException('Album not found');
  }
}
