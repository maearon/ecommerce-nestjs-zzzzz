import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) { }

  // @MessagePattern lắng nghe các request từ client.send()
  // Pattern { cmd: 'create_order' } phải khớp với pattern được gửi từ Gateway
  @MessagePattern({ cmd: 'create_order' })
  async createOrder(@Payload() payload: any) {
    this.logger.log(`[ORDERS] Received create_order request with payload: ${JSON.stringify(payload)}`);

    // Gọi đến service để xử lý logic
    const result = await this.ordersService.createOrder(payload);

    // Bất cứ thứ gì được return ở đây sẽ được gửi ngược lại cho Gateway
    return result;
  }
}
