import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFPreviewProps {
  fileUrl: string;
}

// Set the worker to use the installed version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.worker.min.js`;

const PDFPreview: React.FC<PDFPreviewProps> = ({ fileUrl }) => {
  return (
    <div style={{ height: '500px' }}>
      <Worker workerUrl={pdfjs.GlobalWorkerOptions.workerSrc}>
        <Viewer fileUrl={fileUrl} />
      </Worker>
    </div>
  );
};

export default PDFPreview;
