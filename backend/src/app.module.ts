import { Module } from '@nestjs/common';
import { NodesModule } from './nodes/nodes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, NodesModule],
})
export class AppModule {}
