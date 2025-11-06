import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { RewardsModule } from './rewards.module';
import { EXCHANGE } from '@app/common/constants/exchange';


async function bootstrap() {
  const app = await NestFactory.create(RewardsModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptionsTopic('REWARDS_SERVICE', false, {
    name: EXCHANGE.ORDERS_EXCHANGE,
    type: 'fanout',
  }));
  await app.startAllMicroservices();
  console.log('🎁 Rewards microservice is running and listening for events.');
}
bootstrap();