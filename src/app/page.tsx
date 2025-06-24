import ImageUploader from '@/components/ImageUploader';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-10 space-y-6 border border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
            Organizador de Imágenes en PDF
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Sube tus imágenes y genera documentos PDF listos para imprimir, organizados de forma elegante y eficiente.
          </p>
        </div>
        <ImageUploader />
      </div>
    </main>
  );
}