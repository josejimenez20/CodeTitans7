import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument } from './schema/like.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  // 1. DAR LIKE
  async darMeGusta(userId: string, plantaId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const plantaObjectId = new Types.ObjectId(plantaId);

    // Si no existe, lo creamos
    const existingLike = await this.likeModel.findOne({ user: userObjectId, planta: plantaObjectId });
    if (!existingLike) {
      await this.likeModel.create({ user: userObjectId, planta: plantaObjectId });
    }

    // Devolvemos el total actualizado
    return this.getLikesCount(plantaId);
  }

  // 2. QUITAR LIKE (UNLIKE) - ¡ESTO FALTABA!
  async quitarMeGusta(userId: string, plantaId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const plantaObjectId = new Types.ObjectId(plantaId);

    // Borramos el like si existe
    await this.likeModel.findOneAndDelete({ user: userObjectId, planta: plantaObjectId });

    // Devolvemos el total actualizado
    return this.getLikesCount(plantaId);
  }

  // 3. CONTAR LIKES
  async getLikesCount(plantaId: string) {
    const total = await this.likeModel.countDocuments({ planta: new Types.ObjectId(plantaId) });
    return {
      plantaId: plantaId,
      totalLikes: total,
      success: true
    };
  }
}