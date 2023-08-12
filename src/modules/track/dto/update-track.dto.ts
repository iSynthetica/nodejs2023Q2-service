import { IsInt, IsString, ValidateIf } from 'class-validator';

export class UpdateTrackDto {
  @ValidateIf((o) => o.duration == undefined || o.name)
  @IsString()
  name: string;

  @ValidateIf((o) => o.name == undefined || o.duration)
  @IsInt()
  duration: number;
}
