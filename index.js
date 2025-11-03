import express from 'express';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3002;

// Configurar helpers de Handlebars
handlebars.registerHelper('toKebab', (str) =>
  str.toLowerCase().replace(/ /g, '-').replace(/\|/g, '')
);

handlebars.registerHelper('formatDate', (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Datos de prueba
export const getMockData = () => [
  {
    "id": "5597ebcb-1311-4370-8499-128883eb0fde",
    "date": "2025-10-02",
    "state": "En curso",
    "guardChief": {
      "id": "6d3bd19a-a564-4054-be3f-4db99e116703",
      "name": "Yoangel",
      "lastname": "MIS",
      "email": "yoa13@outlook.com"
    },
    "delegation": {
      "id": "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0",
      "name": "Delegación Ameca, Jalisco"
    }
  },
  {
    "id": "5597ebcb-1311-4370-8499-128883eb0fde",
    "date": "2025-10-02",
    "state": "Nueva",
    "guardChief": {
      "id": "6d3bd19a-a564-4054-be3f-4db99e116703",
      "name": "Yoangel",
      "lastname": "MIS",
      "email": "yoa13@outlook.com"
    },
    "delegation": {
      "id": "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0",
      "name": "Delegación Ameca, Jalisco"
    }
  },
  {
    "id": "a1b2c3d4-5678-9abc-def0-123456789abc",
    "date": "2025-10-03",
    "state": "Cerrada",
    "guardChief": {
      "id": "6d3bd19a-a564-4054-be3f-4db99e116703",
      "name": "Yoangel",
      "lastname": "MIS",
      "email": "yoa13@outlook.com"
    },
    "delegation": {
      "id": "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0",
      "name": "Delegación Ameca, Jalisco"
    }
  },
  {
    "id": "b2c3d4e5-6789-abcd-ef01-23456789abcd",
    "date": "2025-10-04",
    "state": "En curso",
    "guardChief": {
      "id": "7e4cd2ab-b675-5165-cf4g-5ec0ad127814",
      "name": "Dr. Carlos",
      "lastname": "Mendoza",
      "email": "carlos.mendoza@cruzroja.org.mx"
    },
    "delegation": {
      "id": "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0",
      "name": "Delegación Ameca, Jalisco"
    }
  },
  {
    "id": "c3d4e5f6-789a-bcde-f012-3456789abcde",
    "date": "2025-10-05",
    "state": "Nueva",
    "guardChief": {
      "id": "8f5de3bc-c786-6276-dg5h-6fd1be238925",
      "name": "Dra. María",
      "lastname": "González",
      "email": "maria.gonzalez@cruzroja.org.mx"
    },
    "delegation": {
      "id": "e61c9e13-13ba-52b3-99f3-85e8d5cbg0g1",
      "name": "Delegación Tequila, Jalisco"
    }
  }
];

// Función para generar HTML
export const generarHTML = (guardias) => {
  const templatePath = join(__dirname, 'template-pdf.html');
  const templateHtml = readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(templateHtml);

  const stats = {
    total: guardias.length,
    enCurso: guardias.filter(g => g.state.includes('En curso')).length,
    cerradas: guardias.filter(g => g.state === 'Cerrada').length,
    nuevas: guardias.filter(g => g.state === 'Nueva').length,
  };

  return template({
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
};

// Función para generar PDF
export const generarPDF = async (guardias) => {
  const html = generarHTML(guardias);

  console.log('🚀 Iniciando generación de PDF...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { 
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { 
      top: '10mm', 
      right: '10mm', 
      bottom: '10mm', 
      left: '10mm' 
    },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log('✅ PDF generado correctamente');
  return pdf;
};

// RUTAS
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generador de PDFs Cruz Roja</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
            .buttons { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .btn { display: block; padding: 15px 25px; background: #1e40af; color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold; transition: all 0.3s; }
            .btn:hover { background: #1e3a8a; transform: translateY(-2px); }
            .btn.danger { background: #dc2626; }
            .btn.danger:hover { background: #b91c1c; }
            .info { background: #f3f4f6; padding: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏥 Generador de PDFs</h1>
            <p>Cruz Roja Mexicana - Standalone</p>
        </div>
        
        <div class="buttons">
            <a href="/preview" class="btn">👁️ Vista Previa HTML</a>
            <a href="/pdf" class="btn danger">📄 Descargar PDF</a>
            <a href="/datos" class="btn">📊 Ver Datos JSON</a>
            <a href="/api-format" class="btn">🔗 Formato API</a>
        </div>
        
        <div class="info">
            <h3>🚀 Características:</h3>
            <ul>
                <li><strong>Puppeteer + Handlebars:</strong> Generación dinámica de PDFs</li>
                <li><strong>Diseño Profesional:</strong> Colores oficiales de Cruz Roja</li>
                <li><strong>Datos de Prueba:</strong> 6 guardias de ejemplo</li>
                <li><strong>Standalone:</strong> No requiere NestJS ni dependencias complejas</li>
            </ul>
        </div>
    </body>
    </html>
  `);
});

// Vista previa HTML
app.get('/preview', (req, res) => {
  const guardias = getMockData();
  const html = generarHTML(guardias);
  res.send(html);
});

// Generar y descargar PDF
app.get('/pdf', async (req, res) => {
  try {
    const guardias = getMockData();
    const pdf = await generarPDF(guardias);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-guardias-cruzroja.pdf');
    res.send(pdf);
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    res.status(500).send('Error generando PDF: ' + error.message);
  }
});

// Ver datos JSON
app.get('/datos', (req, res) => {
  const guardias = getMockData();
  res.json({
    total: guardias.length,
    guardias
  });
});

// Ver datos en formato API como los proporcionaste
app.get('/api-format', (req, res) => {
  const guardias = getMockData();
  res.json({
    "success": true,
    "data": guardias
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log('🏥 Servidor Cruz Roja iniciado');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`👁️  Vista previa: http://localhost:${PORT}/preview`);
  console.log(`📄 PDF directo: http://localhost:${PORT}/pdf`);
  console.log(`📊 Datos JSON: http://localhost:${PORT}/datos`);
  console.log(`🔗 Formato API: http://localhost:${PORT}/api-format`);
  
  // Abrir automáticamente en el navegador
  try {
    await open(`http://localhost:${PORT}`);
    console.log('🌐 Navegador abierto automáticamente');
  } catch (error) {
    console.log('ℹ️  Abre manualmente: http://localhost:' + PORT);
  }
});