// utils/generatePdf.ts
import { PDFDocument } from 'pdf-lib';
import { calculateGrid } from './gridUtils';

interface ImageData {
  url: string;
  type: string;
}

export async function generatePdf(
  images: ImageData[],
  pageSize: 'A4' | 'Letter',
  imagesPerPage: number,
  columns: number
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const pageWidth = pageSize === 'Letter' ? 612 : 595.28;
  const pageHeight = pageSize === 'Letter' ? 792 : 841.89;

  const cols = columns;
  const rows = Math.ceil(imagesPerPage / cols);

  const cellWidth = pageWidth / cols;
  const cellHeight = pageHeight / rows;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let imagesOnPage = 0;

  for (let i = 0; i < images.length; i++) {
    const { url, type } = images[i];
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const imageBytes = new Uint8Array(buffer);

    let imgEmbed;
    if (type === 'image/jpeg' || type === 'image/jpg') {
      imgEmbed = await pdfDoc.embedJpg(imageBytes);
    } else if (type === 'image/png') {
      imgEmbed = await pdfDoc.embedPng(imageBytes);
    } else {
      continue;
    }

    const col = imagesOnPage % cols;
    const row = Math.floor(imagesOnPage / cols);
    const x = col * cellWidth;
    const y = pageHeight - (row + 1) * cellHeight;

    const maxWidth = cellWidth - 20;
    const maxHeight = cellHeight - 20;

    const imgDims = imgEmbed.scale(1);
    const scale = Math.min(maxWidth / imgDims.width, maxHeight / imgDims.height);

    const drawWidth = imgDims.width * scale;
    const drawHeight = imgDims.height * scale;

    const centerX = x + (cellWidth - drawWidth) / 2;
    const centerY = y + (cellHeight - drawHeight) / 2;

    currentPage.drawImage(imgEmbed, {
      x: centerX,
      y: centerY,
      width: drawWidth,
      height: drawHeight,
    });

    imagesOnPage++;
    if (imagesOnPage >= imagesPerPage && i < images.length - 1) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      imagesOnPage = 0;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

