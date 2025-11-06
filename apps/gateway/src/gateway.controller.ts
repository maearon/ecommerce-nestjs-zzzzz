import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'gateway',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('orders')
  async createOrder(@Body() payload: any) {
    this.logger.log(`[PLACE ORDER1(1)] | GatewayController | Received HTTP order creation request: ${JSON.stringify(payload)}`);
    return this.gatewayService.createOrder(payload);
  }
}
