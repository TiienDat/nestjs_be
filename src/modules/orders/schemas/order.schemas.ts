import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schemas';
import { User } from 'src/modules/users/schemas/user.schemas';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurant.name })
    restaurant: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: mongoose.Schema.Types.ObjectId;

    @Prop()
    status: string;

    @Prop()
    totalPrice: number;

    @Prop()
    orderTime: Date;

    @Prop()
    deliveryTime: Date;

}

export const OrderSchema = SchemaFactory.createForClass(Order);