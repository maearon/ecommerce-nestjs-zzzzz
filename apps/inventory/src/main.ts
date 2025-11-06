import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { InventoryModule } from './inventory.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  const rmqService = app.get<RmqService>(RmqService);

  // Kết nối microservice, lắng nghe trên queue 'INVENTORY_SERVICE_QUEUE'
  app.connectMicroservice(rmqService.getOptions('INVENTORY_SERVICE_QUEUE'));

  await app.startAllMicroservices();
  console.log('✅ Inventory microservice is running and listening for events.');
}
bootstrap();