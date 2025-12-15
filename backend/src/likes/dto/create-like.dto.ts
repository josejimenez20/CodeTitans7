import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  @IsString()
  plantaId: string;
}