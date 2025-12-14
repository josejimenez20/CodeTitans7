import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schema/user.schema'; // Asegúrate que la ruta coincida con tu proyecto
import { Planta } from 'src/plantas/schema/planta.schemas'; // Ruta según tu import en User

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Planta', required: true })
  planta: Planta;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Esto evita que un usuario le de like 2 veces a la misma planta (índice compuesto)
LikeSchema.index({ user: 1, planta: 1 }, { unique: true });