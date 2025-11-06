import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { EVENT } from '@app/common/constants/event';


@Controller()
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(
    // private readonly inventoryService: InventoryService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(EVENT.ORDER_CREATED_EVENT)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`[INVENTORY] Received event for order: ${data.id}`);
    
    // ... Logic nghiệp vụ: gọi this.inventoryService để trừ kho ...
    // Ví dụ: await this.inventoryService.deductStock(data.products);
    
    // Quan trọng: Xác nhận đã xử lý xong message
    this.rmqService.ack(context);
    this.logger.log(`[INVENTORY] Acknowledged event for order ${data.id}`);
  }
}