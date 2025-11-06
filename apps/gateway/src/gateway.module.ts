import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { TCP } from '@app/common/constants/TCP';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TCP.ORDERS_SERVICE, // Tên token để inject
        transport: Transport.TCP,
        options: {
          host: 'localhost', // Hoặc địa chỉ IP của Orders service
          port: 3001, // Port mà Orders service sẽ lắng nghe
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
