import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { PaymentsModule } from './payments.module';
import { EXCHANGE } from '@app/common/constants/exchange';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  // const rmqService = app.get<RmqService>(RmqService);

  // // Kết nối microservice, lắng nghe trên queue 'PAYMENTS_SERVICE_QUEUE'
  // app.connectMicroservice(rmqService.getOptions('PAYMENTS_SERVICE_QUEUE'));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(
    rmqService.getOptionsTopic('PAYMENTS_SERVICE', false, {
      name: EXCHANGE.ORDERS_EXCHANGE,
      type: 'fanout',
    }),
  );
  await app.startAllMicroservices();
  console.log('💳 Payments microservice is running and listening for events.');
}
void bootstrap();
