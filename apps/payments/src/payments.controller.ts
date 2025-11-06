import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { PaymentsService } from './payments.service';
import { EVENT } from '@app/common/constants/event';

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(EVENT.ORDER_CREATED_EVENT)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`[PAYMENTS] Received event for order: ${data.id}`);
    
    // Gọi service để xử lý nghiệp vụ thanh toán
    await this.paymentsService.processPayment(data);
    
    // Xác nhận đã xử lý xong message để RabbitMQ xóa nó khỏi queue
    this.rmqService.ack(context);
    this.logger.log(`[PAYMENTS] Acknowledged event for order ${data.id}`);
  }
}