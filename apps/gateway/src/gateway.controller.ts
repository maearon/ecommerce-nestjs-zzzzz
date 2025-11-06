import { Controller, Post, Body, Logger } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('orders')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  async createOrder(@Body() payload: any) {
    this.logger.log(`[PLACE ORDER1(1)] | GatewayController | Received HTTP order creation request: ${JSON.stringify(payload)}`);
    return this.gatewayService.createOrder(payload);
  }
}
