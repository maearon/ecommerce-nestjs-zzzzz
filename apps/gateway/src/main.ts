import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(GatewayModule);
  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port);
  console.log(`Gateway listening on http://localhost:${port}`);
}
bootstrap();
