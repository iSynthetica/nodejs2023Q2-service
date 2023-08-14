import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from '../../interfaces/artist.interface';
import { v4 as uuidv4 } from 'uuid';

import { artistsDb } from '../../database/artist.data';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './entity/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[];

  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {
    this.artists = artistsDb;
  }

  async getAll(): Promise<Artist[]> {
    return this.artists;
  }

  async get(id: string): Promise<Artist> {
    const returnArtist = this.artists.find((artist) => artist.id === id);
    if (!returnArtist) {
      throw new NotFoundException('Artist not found');
    }

    return returnArtist;
  }

  async create(data: CreateArtistDto) {
    const artist: Artist = {
      id: uuidv4(),
      grammy: false,
      ...data,
    };

    this.artists.push(artist);

    return artist;
  }

  async update(id: string, data: UpdateArtistDto): Promise<Artist> {
    const updatedArtist = this.artists.find((artist) => artist.id === id);

    if (!updatedArtist) {
      throw new NotFoundException('Artist not found');
    }

    if (data.name) updatedArtist.name = data.name;
    if (data.grammy !== undefined) updatedArtist.grammy = data.grammy;

    return updatedArtist;
  }

  async delete(id: string): Promise<boolean> {
    const artistIdx = this.artists.findIndex((artist) => artist.id === id);

    if (artistIdx === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.artists.splice(artistIdx, 1);
    return true;
  }
}
