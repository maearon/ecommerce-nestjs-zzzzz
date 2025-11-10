import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './local/nodeA/.env',
    }),
    // RmqModule.register({name: "INVENTORY_SERVICE"}),
    // RmqModule.register({name: "PAYMENTS_SERVICE"}),
    RmqModule.registerDirectPublisher(),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  exports: [PrismaService],
})
export class OrdersModule {}
