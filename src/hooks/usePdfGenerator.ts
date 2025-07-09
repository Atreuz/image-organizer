import { useState } from 'react';
import { generatePdf } from '@/utils/generatePdf';

export const usePdfGenerator = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleGeneratePdf = async (
    images: { url: string; type: string }[],
    pageSize: 'A4' | 'Letter',
    imagesPerPage: number,
    columns: number
  ) => {
    if (images.length === 0) {
      alert('No hay imágenes para generar el PDF.');
      return;
    }

    try {
      const blob = await generatePdf(images, pageSize, imagesPerPage, columns);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowModal(true);
    } catch (err) {
      alert('Error al generar el PDF. Intenta nuevamente.');
      console.error(err);
    }
  };

  const closeModal = () => setShowModal(false);

  return {
    pdfUrl,
    showModal,
    handleGeneratePdf,
    closeModal,
  };
};
