import { Module } from '@nestjs/common';
import { GuardiaReportModule } from './guardia-report/guardia-report.module';
import { AppController } from './app.controller';

@Module({
  imports: [GuardiaReportModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}