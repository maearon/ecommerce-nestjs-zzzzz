import { EVENT } from '@app/common/constants/event';
import { EXCHANGE } from '@app/common/constants/exchange';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Channel } from 'amqplib';
import { PrismaService } from './prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(EXCHANGE.RMQ_PUBLISHER_CHANNEL) private readonly fanoutChannel: Channel,
    private readonly prisma: PrismaService,
  ) { }

  async onModuleInit() {}

  async createOrder(payload: any) {
    this.logger.log(`[ORDERS] Processing order: ${JSON.stringify(payload)}`);

    // 1. Check stock in inventory (TODO: call inventory service)
    const isStockAvailable = true; // call api -> inventory
    if (!isStockAvailable) {
      throw new BadRequestException("Not enough stock for the requested items...");
    }

    // 2. Calculate total
    const total = (payload.items || []).reduce(
      (sum: number, item: any) => sum + (Number(item.price) || 0) * (item.qty || 0),
      0
    );

    // 3. Create order in database
    const order = await this.prisma.order.create({
      data: {
        customerId: payload.customerId,
        total: total,
        status: OrderStatus.CREATED,
        // Address fields
        firstName: payload.address?.firstName,
        lastName: payload.address?.lastName,
        street: payload.address?.street,
        apartment: payload.address?.apartment,
        city: payload.address?.city,
        state: payload.address?.state,
        zipCode: payload.address?.zipCode,
        country: payload.address?.country || "US",
        phone: payload.address?.phone,
        formattedAddress: payload.address?.formattedAddress,
        items: {
          create: (payload.items || []).map((item: any) => ({
            sku: item.sku,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    this.logger.log(`[ORDERS] Order created in DB with ID: ${order.id}`);

    // 4. Publish event to EVENT BUS via FANOUT exchange
    const exchangeName = EXCHANGE.ORDERS_EXCHANGE;
    const routingKey = EVENT.ORDER_CREATED_EVENT;

    const eventPayload = {
      data: {
        id: order.id,
        customerId: order.customerId,
        items: order.items,
        total: order.total.toString(), // Decimal to string
        status: order.status,
        createdAt: order.createdAt,
      },
      pattern: routingKey,
    };

    this.fanoutChannel.publish(
      exchangeName,
      routingKey, // routing key is ignored in fanout exchange
      Buffer.from(JSON.stringify(eventPayload))
    );

    this.logger.log(`[ORDERS] Order event published with ID: ${order.id}`);

    return {
      message: `Order created with ID: ${order.id} OK`,
      orderId: order.id,
      total: order.total.toString(),
      status: order.status,
    };
  }
}