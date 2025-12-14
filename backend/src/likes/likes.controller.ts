import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { AuthGuard } from '@nestjs/passport';

// CAMBIO IMPORTANTE: La ruta base ahora es solo 'plantas'
@Controller('plantas')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('like') // Esto crea la ruta: /plantas/like
  @UseGuards(AuthGuard('jwt'))
  async darLike(@Body() createLikeDto: CreateLikeDto, @Req() req) {
    const userId = req.user._id || req.user.sub;
    return this.likesService.darMeGusta(userId, createLikeDto.plantaId);
  }

  @Post('unlike') // Esto crea la ruta: /plantas/unlike (Para arreglar tu error 404)
  @UseGuards(AuthGuard('jwt'))
  async quitarLike(@Body() createLikeDto: CreateLikeDto, @Req() req) {
    const userId = req.user._id || req.user.sub;
    return this.likesService.quitarMeGusta(userId, createLikeDto.plantaId);
  }

  @Get('likes/:plantaId') // Ruta para consultar: /plantas/likes/ID
  async getLikes(@Param('plantaId') plantaId: string) {
    return this.likesService.getLikesCount(plantaId);
  }
}