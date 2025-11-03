// guardia-report/guardia-report.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GuardiaReportService } from './guardia-report.service';
import { GuardiaReportController } from './guardia-report.controller';

@Module({
  imports: [HttpModule],
  controllers: [GuardiaReportController],
  providers: [GuardiaReportService],
  exports: [GuardiaReportService],
})
export class GuardiaReportModule {}