import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column()
  duration: number;

  @Column({
    type: 'uuid',
  })
  artistId: string;

  @Column({
    type: 'uuid',
  })
  albumId: string;
}
