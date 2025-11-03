import { getMockData, generarHTML, generarPDF } from './index.js';
import { writeFileSync } from 'fs';

console.log('🧪 Ejecutando pruebas del generador de PDF...\n');

// Test 1: Verificar datos de prueba
console.log('1️⃣ Probando datos de prueba...');
const guardias = getMockData();
console.log(`✅ ${guardias.length} guardias cargadas`);
console.log(`📊 Estados: ${[...new Set(guardias.map(g => g.state))].join(', ')}`);

// Test 2: Generar HTML
console.log('\n2️⃣ Probando generación de HTML...');
try {
  const html = generarHTML(guardias);
  console.log(`✅ HTML generado: ${html.length} caracteres`);
  console.log('✅ Template Handlebars compilado correctamente');
} catch (error) {
  console.error('❌ Error generando HTML:', error.message);
}

// Test 3: Generar PDF
console.log('\n3️⃣ Probando generación de PDF...');
try {
  const pdf = await generarPDF(guardias);
  console.log(`✅ PDF generado: ${pdf.length} bytes`);
  
  // Guardar PDF de prueba
  writeFileSync('test-reporte.pdf', pdf);
  console.log('✅ PDF guardado como: test-reporte.pdf');
} catch (error) {
  console.error('❌ Error generando PDF:', error.message);
}

console.log('\n🎉 Pruebas completadas!');
console.log('🚀 Ejecuta "npm start" para iniciar el servidor web');