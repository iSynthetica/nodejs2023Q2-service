import { IsInt, IsString, ValidateIf } from 'class-validator';

export class UpdateAlbumDto {
  @ValidateIf((o) => o.year == undefined || o.name)
  @IsString()
  name: string;

  @ValidateIf((o) => o.name == undefined || o.year)
  @IsInt()
  year: number;
}
