This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Image Organizer Features (Custom)

### Subir Imágenes
Tienes tres formas de añadir imágenes:

1. Botón / selector de archivos (click en el área punteada).
2. Arrastrar y soltar (drag & drop) directamente dentro del recuadro "Sube / Arrastra tus imágenes".
3. Pegar desde el portapapeles (Ctrl+V / Cmd+V) si has copiado una imagen (por ejemplo desde otra pestaña o una captura de pantalla).

Formatos aceptados actualmente: JPG y PNG.

### Generación de PDF
Configura:
- Tamaño de hoja (A4 o Carta)
- Número de imágenes por hoja
- Columnas

Luego pulsa "Generar documento" para ver la vista previa del PDF y poder imprimir o descargar.

### Recorte de imágenes
Cada miniatura tiene una opción de recorte que abre un modal para ajustar el área visible antes de generar el PDF.

### Consejos
- Puedes seguir pegando o arrastrando más imágenes sin perder las ya añadidas.
- Si pegas varias imágenes desde el portapapeles, aparecerá un mensaje de confirmación.
- Usa el botón ✕ en la sección de vista previa de imágenes para limpiar todas.

---

## Development Notes

Drag & Drop y paste se manejan en `src/components/ImageUploader.tsx` y el almacenamiento en memoria temporal de imágenes en `src/hooks/useImageHandler.ts` (se crean Object URLs para previsualización). El PDF se genera con `pdf-lib` en `src/utils/generatePdf.ts`.

