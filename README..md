# 🏥 Generador de PDFs Cruz Roja - Standalone

Módulo standalone para generar reportes PDF profesionales de guardias médicas usando **Puppeteer + Handlebars**.

## ✅ **Estado Actual**
- ✅ **Servidor funcionando** en puerto 3002
- ✅ **Datos actualizados** con tu estructura exacta
- ✅ **Diseño profesional** con colores Cruz Roja
- ✅ **Formato API** implementado

## 🚀 **URLs Disponibles**

| Función | URL | Descripción |
|---------|-----|-------------|
| **🏠 Página Principal** | http://localhost:3002 | Interfaz principal con todos los enlaces |
| **👁️ Vista Previa** | http://localhost:3002/preview | Ver el diseño del PDF en HTML |
| **📄 Descargar PDF** | http://localhost:3002/pdf | Descargar PDF directamente |
| **📊 Datos JSON** | http://localhost:3002/datos | Ver datos formateados |
| **🔗 Formato API** | http://localhost:3002/api-format | Datos en formato API original |

## 📋 **Datos Actuales**

El sistema ahora usa exactamente los datos:

```json
{
  "success": true,
  "data": [
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
    }
    // ... más registros
  ]
}
```

## 🎨 **Características del Diseño**

- **Header Cruz Roja**: Logo y colores oficiales (#dc2626)
- **Estadísticas**: Resumen visual de guardias por estado
- **Tabla responsive**: Información clara y organizada
- **Estados con badges**: 
  - 🟡 **En curso**: Amarillo
  - 🟢 **Nueva**: Verde  
  - 🔴 **Cerrada**: Rojo
- **Información completa**: Jefe de guardia con email y delegación

## 🔧 **Tecnologías**

- **Puppeteer**: Generación de PDF desde HTML
- **Handlebars**: Templates dinámicos
- **Express**: Servidor web ligero
- **CSS Grid/Flexbox**: Diseño responsive

## 📦 **Estructura de Archivos**

```
pdf_modulo_cruzroja/
├── index.js              # 🎯 Servidor principal
├── template-pdf.html     # 🎨 Template del PDF
├── package.json          # 📦 Dependencias
├── test.js              # 🧪 Pruebas
└── README.md            # 📖 Esta documentación
```

## 🚀 **Para Desarrollo Futuro**

1. **Integración**: Copia las funciones `generarHTML()` y `generarPDF()` 
2. **API Real**: Cambia `getMockData()` por tu endpoint real
3. **Personalización**: Edita `template-pdf.html` para ajustar diseño
4. **Deploy**: El código es standalone y fácil de desplegar

## 🏃‍♂️ **Comandos Rápidos**

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Ejecutar pruebas
npm test
```

## 💡 **Próximos Pasos**

1. **Ver vista previa**: Abre http://localhost:3002/preview
2. **Probar PDF**: Descarga desde http://localhost:3002/pdf
3. **Verificar datos**: Revisa http://localhost:3002/api-format
4. **Integrar**: Usa las funciones en tu sistema principal

---

**🏥 Cruz Roja Mexicana - Sistema de Guardias © 2025**