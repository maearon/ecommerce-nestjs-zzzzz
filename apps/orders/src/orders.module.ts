import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { EXCHANGE } from '@app/common/constants/exchange';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: './local/nodeA/.env', 
    }),
    // RmqModule.register({name: "INVENTORY_SERVICE"}),
    // RmqModule.register({name: "PAYMENTS_SERVICE"}),
    RmqModule.registerDirectPublisher()
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
