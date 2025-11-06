// guardia-report/guardia-report.controller.ts
import { Controller, Get, Res, Header, Query, Post, Body } from '@nestjs/common';
import { GuardiaReportService } from './guardia-report.service';
import { Response } from 'express';
import { ChecklistAmbulanciaDto } from './dto/checklist-ambulancia.dto';

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

  // ==================== RUTAS PARA CHECKLIST DE AMBULANCIA ====================

  @Get('checklist/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=checklist-ambulancia.pdf')
  async generarChecklistPDF(@Res() res: Response) {
    const pdf = await this.reportService.generarChecklistPDF();
    res.send(pdf);
  }

  @Post('checklist/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=checklist-ambulancia.pdf')
  async generarChecklistPDFConDatos(@Body() checklistData: ChecklistAmbulanciaDto, @Res() res: Response) {
    const pdf = await this.reportService.generarChecklistPDF(checklistData);
    res.send(pdf);
  }

  @Get('checklist/preview')
  @Header('Content-Type', 'text/html')
  async previewChecklistHTML(@Res() res: Response) {
    const html = await this.reportService.generarChecklistHTML();
    res.send(html);
  }

  @Post('checklist/preview')
  @Header('Content-Type', 'text/html')
  async previewChecklistHTMLConDatos(@Body() checklistData: ChecklistAmbulanciaDto, @Res() res: Response) {
    const html = await this.reportService.generarChecklistHTML(checklistData);
    res.send(html);
  }

  @Get('checklist/test')
  async testChecklistData() {
    return this.reportService.getMockChecklistData();
  }
}