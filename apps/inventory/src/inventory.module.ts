import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Quan trọng: Chỉ định đúng đường dẫn tới file .env của nodeB
      envFilePath: './local/nodeB/.env', 
    }),
    RmqModule, // Import module Rmq chung để có thể inject RmqService
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}