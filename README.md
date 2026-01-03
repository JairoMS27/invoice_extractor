# Invoice Extractor

Aplicación web para extraer datos de facturas automáticamente usando inteligencia artificial. Sube una imagen o PDF de una factura y obtén los datos estructurados listos para exportar.

## Características

- **Extracción con IA**: Utiliza Google Gemini para analizar y extraer datos de facturas
- **Múltiples formatos de entrada**: Soporta imágenes (JPEG, PNG, WebP, GIF) y PDF
- **Exportación flexible**: Exporta los datos a Excel, CSV, JSON o PDF
- **Interfaz moderna**: UI responsive construida con React 19 y Tailwind CSS
- **Validación de datos**: Esquemas Zod para garantizar la integridad de los datos extraídos

## Datos extraídos

- Número de factura
- Fecha
- Datos del vendedor (nombre, NIF, dirección)
- Líneas de detalle (descripción, cantidad, precio unitario, total)
- Subtotal, impuestos y total
- Moneda
- Nivel de confianza de la extracción

## Tecnologías

- **Framework**: Next.js 15 con Turbopack
- **Frontend**: React 19, Tailwind CSS, Radix UI
- **IA**: Google Gemini (via LangChain)
- **Validación**: Zod
- **Exportación**: xlsx, csv-stringify, jsPDF

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/JairoMS27/invoice_extractor.git
cd invoice_extractor
```

2. Instala las dependencias:
```bash
bun install
# o
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Añade tu API key de Google AI en `.env.local`:
```env
GOOGLE_API_KEY=tu_api_key_aqui
```

Puedes obtener tu API key en [Google AI Studio](https://makersuite.google.com/app/apikey).

## Uso

1. Inicia el servidor de desarrollo:
```bash
bun dev
# o
npm run dev
```

2. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

3. Arrastra o selecciona una factura (imagen o PDF)

4. Espera a que la IA procese el documento

5. Revisa los datos extraídos y exporta en el formato deseado

## Scripts disponibles

- `bun dev` - Inicia el servidor de desarrollo
- `bun build` - Compila la aplicación para producción
- `bun start` - Inicia el servidor de producción
- `bun lint` - Ejecuta el linter

## Estructura del proyecto

```
├── app/
│   ├── api/
│   │   ├── extract/     # API para extracción de datos
│   │   └── export/      # API para exportación
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Componentes base (Button, Card, etc.)
│   └── ...              # Componentes específicos
├── lib/
│   ├── agents/          # Agente de IA para extracción
│   ├── types.ts         # Tipos y esquemas Zod
│   └── utils.ts
└── ...
```

## Licencia

MIT
