// guardia-report/guardia-report.controller.ts
import { Controller, Get, Res, Header, Query } from '@nestjs/common';
import { GuardiaReportService } from './guardia-report.service';
import { Response } from 'express';

@Controller('guardias')
export class GuardiaReportController {
  constructor(private readonly reportService: GuardiaReportService) {}

  @Get('pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=reporte-guardias.pdf')
  async generarPDF(@Res() res: Response) {
    const pdf = await this.reportService.generarPDF();
    res.send(pdf);
  }

  @Get('pdf/preview')
  @Header('Content-Type', 'text/html')
  async previewPDF(@Res() res: Response, @Query('mock') useMock?: string) {
    const html = await this.reportService.generarHTML(useMock === 'true');
    res.send(html);
  }

  @Get('test')
  async testData() {
    return await this.reportService.obtenerGuardias();
  }
}