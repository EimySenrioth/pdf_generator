// guardia-report/guardia-report.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Guardia } from './interfaces/guardia.interface';
import { ChecklistAmbulancia } from './interfaces/checklist-ambulancia.interface';
import { InformeChecklistInsumos } from './interfaces/informe-checklist-insumos.interface';

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

  // ==================== MÉTODOS PARA CHECKLIST DE AMBULANCIA ====================

  getMockChecklistData(): ChecklistAmbulancia {
    return {
      ambulancia: "AMB-001",
      fecha: new Date().toLocaleDateString('es-MX'),
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      kilometraje: "45,320 km",
      valeGas: "Sí",
      jefeGuardia: "Dr. Juan Pérez",
      operador: "Luis García",
      tum: "Ana Martínez",
      items: [
        {
          numero: 1,
          nombre: "Apariencia general",
          incidencias: [
            { descripcion: "Estado general", estado: "satisfactorio", estadoTexto: "Satisfactorio" }
          ]
        },
        {
          numero: 2,
          nombre: "Compartimiento del operador",
          incidencias: [
            { descripcion: "Asiento y controles", estado: "satisfactorio", estadoTexto: "Satisfactorio" }
          ]
        },
        {
          numero: 3,
          nombre: "Compartimiento del motor",
          incidencias: [
            { descripcion: "Acumulador", estado: "regular", estadoTexto: "Regular" },
            { descripcion: "Líquido de frenos", estado: "malo", estadoTexto: "Malo" }
          ]
        },
        {
          numero: 4,
          nombre: "Recorrido exterior lado operador",
          incidencias: [
            { descripcion: "Ventana del operador", estado: "regular", estadoTexto: "Regular" },
            { descripcion: "Defensa lateral", estado: "malo", estadoTexto: "Malo" }
          ]
        },
        {
          numero: 5,
          nombre: "Recorrido exterior frente",
          incidencias: [
            { descripcion: "Parabrisas", estado: "regular", estadoTexto: "Regular" },
            { descripcion: "Direccionales", estado: "malo", estadoTexto: "Malo" },
            { descripcion: "Parrilla de la unidad", estado: "malo", estadoTexto: "Malo" }
          ]
        },
        {
          numero: 6,
          nombre: "Recorrido exterior lado copiloto",
          incidencias: [
            { descripcion: "Ventana del operador", estado: "regular", estadoTexto: "Regular" },
            { descripcion: "Defensa lateral", estado: "malo", estadoTexto: "Malo" }
          ]
        },
        {
          numero: 7,
          nombre: "Compartimiento del paciente",
          incidencias: [
            { descripcion: "Aspirador Amb.", estado: "regular", estadoTexto: "Regular" },
            { descripcion: "Carro camilla", estado: "malo", estadoTexto: "Malo" },
            { descripcion: "Sujetadores", estado: "malo", estadoTexto: "Malo" },
            { descripcion: "Oxígeno central 2200 lb", estado: "satisfactorio", estadoTexto: "Satisfactorio" }
          ]
        },
        {
          numero: 8,
          nombre: "Recorrido exterior posterior",
          incidencias: [
            { descripcion: "Luces de reversa", estado: "regular", estadoTexto: "Regular" },
            { descripcion: "Ventanas", estado: "malo", estadoTexto: "Malo" },
            { descripcion: "Llanta de refacción", estado: "malo", estadoTexto: "Malo" },
            { descripcion: "Llanta izquierda (inflado y apariencia) 32 lb", estado: "satisfactorio", estadoTexto: "Satisfactorio" }
          ]
        },
        {
          numero: 9,
          nombre: "Herramienta y aditamentos",
          incidencias: [
            { descripcion: "Extintor", estado: "regular", estadoTexto: "Regular" },
            { descripcion: "Kit de herramientas", estado: "malo", estadoTexto: "Malo" }
          ]
        }
      ],
      notas: "Se requiere mantenimiento urgente en sistema de frenos y reemplazo de direccionales. La ambulancia presenta desgaste notable en defensa lateral izquierda. Se recomienda revisión completa antes del próximo servicio.",
      entrega: {
        nombre: "Carlos Rodríguez",
        cargo: "Supervisor de Turno"
      },
      recibe: {
        nombre: "María López",
        cargo: "Jefe de Guardia"
      }
    };
  }

  async generarChecklistHTML(data?: ChecklistAmbulancia): Promise<string> {
    const checklistData = data || this.getMockChecklistData();

    const templatePath = join(__dirname, 'templates', 'checklist-ambulancia.html');
    const templateHtml = await readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    return template(checklistData);
  }

  async generarChecklistPDF(data?: ChecklistAmbulancia): Promise<Buffer> {
    const html = await this.generarChecklistHTML(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
      displayHeaderFooter: false,
      scale: 1.0,
    });

    await browser.close();
    return pdf;
  }

  // ==================== MÉTODOS PARA INFORME CHECKLIST DE INSUMOS ====================

  getMockInsumosData(): InformeChecklistInsumos {
    return {
      division: "División Metropolitana Norte",
      ambulancia: "AMB-002",
      fecha: new Date().toLocaleDateString('es-MX'),
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      jefeGuardia: "Dr. María González",
      tum: "Carlos López",
      gabinetes: [
        {
          titulo: "Gabinete 1. Equipo de vías aéreas",
          items: [
            {
              categoria: "Bolsa de válvula-mascarilla (BVM)",
              especificacion: "Adulto",
              cantidad: 0,
              observacion: "Existe un déficit de 1 insumo(s) de este tipo",
              deficit: true,
              esPrimera: true,
              rowspan: 3
            },
            {
              categoria: "Bolsa de válvula-mascarilla (BVM)",
              especificacion: "Pediátrico",
              cantidad: 0,
              observacion: "Existe un déficit de 1 insumo(s) de este tipo",
              deficit: true
            },
            {
              categoria: "Bolsa de válvula-mascarilla (BVM)",
              especificacion: "Neonato",
              cantidad: 0,
              observacion: "Existe un déficit de 1 insumo(s) de este tipo",
              deficit: true
            },
            {
              categoria: "Mascarilla sin reservorio",
              especificacion: "Adulto",
              cantidad: 2,
              observacion: "Existe un déficit de 2 insumo(s) de este tipo",
              deficit: true,
              esPrimera: true,
              rowspan: 2
            },
            {
              categoria: "Mascarilla sin reservorio",
              especificacion: "Pediátrico",
              cantidad: 2,
              observacion: "Existe un déficit de 2 insumo(s) de este tipo",
              deficit: true
            },
            {
              categoria: "Mascarilla con reservorio",
              especificacion: "Adulto",
              cantidad: 1,
              observacion: "Existe un déficit de 3 insumo(s) de este tipo",
              deficit: true
            }
          ]
        },
        {
          titulo: "Gabinete 2. Equipo de circulación y control de hemorragias",
          items: [
            {
              categoria: "Esfigmomanómetro",
              especificacion: "Adulto",
              cantidad: 1,
              observacion: "Stock completo",
              deficit: false,
              esPrimera: true,
              rowspan: 2
            },
            {
              categoria: "Esfigmomanómetro",
              especificacion: "Pediátrico",
              cantidad: 1,
              observacion: "Stock completo",
              deficit: false
            },
            {
              categoria: "Torniquete",
              especificacion: "Estándar",
              cantidad: 3,
              observacion: "Stock completo",
              deficit: false
            },
            {
              categoria: "Vendajes hemostáticos",
              especificacion: "Quick Clot",
              cantidad: 2,
              observacion: "Existe un déficit de 1 insumo(s) de este tipo",
              deficit: true
            }
          ]
        },
        {
          titulo: "Gabinete 3. Material de curación y vendajes",
          items: [
            {
              categoria: "Gasas estériles",
              especificacion: "5x5 cm",
              cantidad: 10,
              observacion: "Stock completo",
              deficit: false,
              esPrimera: true,
              rowspan: 2
            },
            {
              categoria: "Gasas estériles",
              especificacion: "10x10 cm",
              cantidad: 5,
              observacion: "Existe un déficit de 5 insumo(s) de este tipo",
              deficit: true
            },
            {
              categoria: "Vendas elásticas",
              especificacion: "5 cm",
              cantidad: 8,
              observacion: "Stock completo",
              deficit: false,
              esPrimera: true,
              rowspan: 2
            },
            {
              categoria: "Vendas elásticas",
              especificacion: "10 cm",
              cantidad: 4,
              observacion: "Existe un déficit de 2 insumo(s) de este tipo",
              deficit: true
            }
          ]
        }
      ],
      notas: "Se requiere reposición urgente de BVM adulto y pediátrico. Las mascarillas con reservorio necesitan revisión de fecha de vencimiento. El stock de vendajes hemostáticos está por debajo del mínimo requerido para servicios de emergencia.",
      entrega: {
        nombre: "Ana Martínez",
        cargo: "Supervisora de Insumos"
      },
      recibe: {
        nombre: "Roberto Silva",
        cargo: "Jefe de Guardia Entrante"
      }
    };
  }

  async generarInsumosHTML(data?: InformeChecklistInsumos): Promise<string> {
    const insumosData = data || this.getMockInsumosData();

    const templatePath = join(__dirname, 'templates', 'informe-checklist-insumos.html');
    const templateHtml = await readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    return template(insumosData);
  }

  async generarInsumosPDF(data?: InformeChecklistInsumos): Promise<Buffer> {
    const html = await this.generarInsumosHTML(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
      displayHeaderFooter: false,
      scale: 1.0,
    });

    await browser.close();
    return pdf;
  }
}