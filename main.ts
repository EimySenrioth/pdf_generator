import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS si es necesario
  app.enableCors();
  
  // Puerto de la aplicación
  const port = process.env.PORT || 3003;
  
  await app.listen(port);
  console.log(`Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`Vista previa PDF: http://localhost:${port}/guardias/pdf/preview?mock=true`);
  console.log(`Descargar PDF: http://localhost:${port}/guardias/pdf`);
  console.log(`Datos de prueba: http://localhost:${port}/guardias/test`);
}

bootstrap();