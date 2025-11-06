import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule, RmqService } from '@app/common';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './local/nodeB/.env', 
    }),
    RmqModule
  ],
  controllers: [RewardsController],
  providers: [RewardsService, RmqService],
})
export class RewardsModule {}