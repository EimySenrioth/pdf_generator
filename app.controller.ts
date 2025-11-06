import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHome() {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sistema de Guardias - Cruz Roja</title>
          <style>
              body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                  max-width: 800px; 
                  margin: 50px auto; 
                  padding: 20px; 
                  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                  min-height: 100vh;
              }
              .header { 
                  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                  color: white; 
                  padding: 30px; 
                  border-radius: 12px; 
                  text-align: center; 
                  margin-bottom: 30px; 
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.2);
              }
              .logo {
                  width: 50px;
                  height: 50px;
                  background: white;
                  border-radius: 50%;
                  margin: 0 auto 15px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  color: #dc2626;
                  font-size: 20px;
              }
              .buttons { 
                  display: grid; 
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                  gap: 20px; 
                  margin-bottom: 30px; 
              }
              .btn { 
                  display: block; 
                  padding: 18px 25px; 
                  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 10px; 
                  text-align: center; 
                  font-weight: 600; 
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 15px rgba(30, 64, 175, 0.2);
              }
              .btn:hover { 
                  transform: translateY(-2px); 
                  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.3);
              }
              .btn.danger { 
                  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
              }
              .btn.danger:hover { 
                  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
              }
              .info { 
                  background: white; 
                  padding: 25px; 
                  border-radius: 12px; 
                  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              }
              .info h3 {
                  color: #1e293b;
                  margin-bottom: 15px;
              }
              .info ul {
                  color: #64748b;
                  line-height: 1.6;
              }
              .info li {
                  margin-bottom: 8px;
              }
              .status {
                  background: #dcfce7;
                  color: #166534;
                  padding: 10px 15px;
                  border-radius: 8px;
                  margin-bottom: 20px;
                  border-left: 4px solid #16a34a;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="logo">+</div>
              <h1>🏥 Sistema de Guardias</h1>
              <p>Cruz Roja Mexicana - Generador de Reportes PDF</p>
          </div>
          
          <div class="status">
              ✅ Servidor NestJS funcionando correctamente en puerto 3000
          </div>
          
          <div class="buttons">
              <a href="/guardias/pdf/preview?mock=true" class="btn">👁️ Vista Previa Guardias</a>
              <a href="/guardias/pdf" class="btn danger">📄 PDF Guardias</a>
              <a href="/guardias/test" class="btn">📊 Datos Guardias</a>
          </div>

          <div class="buttons">
              <a href="/guardias/checklist/preview" class="btn">🚑 Vista Previa Checklist</a>
              <a href="/guardias/checklist/pdf" class="btn danger">📋 PDF Checklist</a>
              <a href="/guardias/checklist/test" class="btn">� Datos Checklist</a>
          </div>
          
          <div class="info">
              <h3>🚀 Funcionalidades Disponibles:</h3>
              <ul>
                  <li><strong>Reportes de Guardias:</strong> Sistema completo de reportes médicos</li>
                  <li><strong>Checklist de Ambulancia:</strong> Inspección vehicular profesional</li>
                  <li><strong>Vista Previa HTML:</strong> Visualiza el diseño antes de generar el PDF</li>
                  <li><strong>Generación de PDF:</strong> Descarga reportes profesionales con Puppeteer</li>
                  <li><strong>Datos de Prueba:</strong> Sistema con datos realistas</li>
                  <li><strong>Diseño Cruz Roja:</strong> Colores oficiales y diseño profesional</li>
                  <li><strong>NestJS + TypeScript:</strong> Arquitectura moderna y escalable</li>
              </ul>
              
              <h3 style="margin-top: 20px;">🔗 Endpoints disponibles:</h3>
              <ul>
                  <li><code>GET /</code> - Esta página de inicio</li>
                  <li><code>GET /guardias/pdf</code> - Descargar PDF de guardias</li>
                  <li><code>GET /guardias/pdf/preview</code> - Vista previa guardias</li>
                  <li><code>GET /guardias/test</code> - Datos JSON de guardias</li>
                  <li><code>GET /guardias/checklist/pdf</code> - Descargar PDF checklist</li>
                  <li><code>GET /guardias/checklist/preview</code> - Vista previa checklist</li>
                  <li><code>GET /guardias/checklist/test</code> - Datos JSON checklist</li>
              </ul>
          </div>
      </body>
      </html>
    `;
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Guardia Report PDF Generator',
      version: '1.0.0'
    };
  }
}