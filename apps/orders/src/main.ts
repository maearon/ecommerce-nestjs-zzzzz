import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001, // Port phải khớp với cấu hình ở GatewayModule
      },
    }
  );

  await app.listen();
  console.log('Orders microservice is listening on port 3001');
}
bootstrap();
