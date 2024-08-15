import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MenuItemOption } from 'src/modules/menu.item.options/schemas/menu.item.option.schemas';
import { MenuItem } from 'src/modules/menu.items/schemas/menu.item.schemas';
import { Menu } from 'src/modules/menus/schemas/menu.schemas';
import { Order } from 'src/modules/orders/schemas/order.schemas';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ timestamps: true })
export class OrderDetail {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Order.name })
    order: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Menu.name })
    menu: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
    menuItem: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItemOption.name })
    menuItemOption: mongoose.Schema.Types.ObjectId;

}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);