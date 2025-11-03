// guardia-report/guardia-report.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Guardia } from './interfaces/guardia.interface';

@Injectable()
export class GuardiaReportService {
  private readonly apiUrl = 'https://tu-api.com/guardias'; // Cambia por tu URL
  private readonly token = 'tu-token-aqui';

  constructor(private readonly httpService: HttpService) {
    this.registerHelpers();
  }

  private registerHelpers() {
    Handlebars.registerHelper('toKebab', (str: string) =>
      str.toLowerCase().replace(/ /g, '-').replace(/\|/g, ''),
    );
    Handlebars.registerHelper('formatDate', (date: string) => {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });
  }

  // Datos de prueba para testing
  private getMockData(): Guardia[] {
    return [
      {
        id: '5597ebcb-1311-4370-8499-128883eb0fde',
        date: '2025-10-02',
        state: 'En curso',
        guardChief: {
          id: '6d3bd19a-a564-4054-be3f-4db99e116703',
          name: 'Yoangel',
          lastname: 'MIS',
          email: 'yoa13@outlook.com'
        },
        delegation: {
          id: 'd50b8d02-02a9-41a2-88e2-74e7c4baf9f0',
          name: 'Delegación Ameca, Jalisco'
        }
      },
      {
        id: '5597ebcb-1311-4370-8499-128883eb0fde',
        date: '2025-10-02',
        state: 'Nueva',
        guardChief: {
          id: '6d3bd19a-a564-4054-be3f-4db99e116703',
          name: 'Yoangel',
          lastname: 'MIS',
          email: 'yoa13@outlook.com'
        },
        delegation: {
          id: 'd50b8d02-02a9-41a2-88e2-74e7c4baf9f0',
          name: 'Delegación Ameca, Jalisco'
        }
      },
      {
        id: 'a1b2c3d4-5678-9abc-def0-123456789abc',
        date: '2025-10-03',
        state: 'Cerrada',
        guardChief: {
          id: '6d3bd19a-a564-4054-be3f-4db99e116703',
          name: 'Yoangel',
          lastname: 'MIS',
          email: 'yoa13@outlook.com'
        },
        delegation: {
          id: 'd50b8d02-02a9-41a2-88e2-74e7c4baf9f0',
          name: 'Delegación Ameca, Jalisco'
        }
      }
    ];
  }

  async obtenerGuardias(useMock: boolean = true): Promise<Guardia[]> {
    if (useMock) {
      return this.getMockData();
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.apiUrl, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
        }),
      );

      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.warn('Error al obtener datos de API, usando datos de prueba:', error.message);
      return this.getMockData();
    }
  }

  async generarHTML(useMock: boolean = true): Promise<string> {
    const guardias = await this.obtenerGuardias(useMock);

    const templatePath = join(__dirname, 'templates', 'guardia-report.html');
    const templateHtml = await readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    const stats = {
      total: guardias.length,
      enCurso: guardias.filter(g => g.state.includes('En curso')).length,
      cerradas: guardias.filter(g => g.state === 'Cerrada').length,
      nuevas: guardias.filter(g => g.state === 'Nueva').length,
    };

    const html = template({
      guardias,
      ...stats,
      delegacionNombre: 'Ameca, Jalisco',
      fecha: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    return html;
  }

  async generarPDF(useMock: boolean = true): Promise<Buffer> {
    const html = await this.generarHTML(useMock);

    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport para mejor renderizado
    await page.setViewport({ 
      width: 794, 
      height: 1123, 
      deviceScaleFactor: 1 
    });
    
    await page.setContent(html, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { 
        top: '12mm', 
        right: '12mm', 
        bottom: '12mm', 
        left: '12mm' 
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      scale: 0.95, // Reducir escala para evitar cortes
    });

    await browser.close();
    return pdf;
  }
}