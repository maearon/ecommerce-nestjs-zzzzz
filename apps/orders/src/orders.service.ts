
import { EVENT } from '@app/common/constants/event';
import { EXCHANGE } from '@app/common/constants/exchange';
import {BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Channel } from 'amqplib';


@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(EXCHANGE.RMQ_PUBLISHER_CHANNEL) private readonly fanoutChannel: Channel,
  ) { }

  async onModuleInit() {}

  async createOrder(payload: any) {
    this.logger.log(`[ORDERS] Processing order: ${JSON.stringify(payload)}`);

    // 1. Check stock in inventory
    const isStockAvailbale = true// call api -> inventory
    if(!isStockAvailbale){
      throw new BadRequestException("Not enough stock fot the req items...")
    }
    const total = (payload.items || []).reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);
    const order = {
      id: Math.floor(Math.random() * 1000000), // fake ID
      customerId: payload.customerId,
      items: JSON.stringify(payload.items || []),
      total,
      status: 'CREATED',
      createdAt: new Date(),
    };

    // Publish event to EVENT BUS via FANOUT exchange
    const exchangeName = EXCHANGE.ORDERS_EXCHANGE;
    const routingKey = EVENT.ORDER_CREATED_EVENT;

    const eventPayload = {
      data: order,
      pattern: routingKey
    };

    this.fanoutChannel.publish(
      exchangeName,
      routingKey, // routing key is ignored in fanout exchange
      Buffer.from(JSON.stringify(eventPayload))
    );
    
    this.logger.log(`[ORDERS] Order created with ID: ${order.id}`);

    return `Order created with ID: ${order.id} OK`; // return gateway api
  }
}