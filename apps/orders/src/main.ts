import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  
  const port = parseInt(process.env.TCP_PORT || '3001', 10);
  const host = process.env.TCP_HOST || '0.0.0.0'; // Use 0.0.0.0 for Docker
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    }
  );

  const port = process.env.ORDERS_PORT || 3000;
  await app.listen(port);
  console.log(`Orders microservice is listening on ${host}:${port}`);
}
bootstrap();
