import { useState } from 'react';
import { Download, ExternalLink, BookOpen, Eye, EyeOff, FileText, Maximize2 } from 'lucide-react';
import './PdfViewer.css';

function PdfViewer({
  title = 'Dokumen PDF',
  subtitle = '',
  pdfUrl,
  downloadName,
  initialOpen = false,
  badgeText = 'Dokumen PDF',
  pageCountText = '',
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  if (!pdfUrl) return null;

  return (
    <div className="pdf-viewer-card card-light" aria-label={`Viewer Dokumen: ${title}`}>
      <div className="pdf-viewer-card__header">
        <div className="pdf-viewer-card__info-col">
          <div className="pdf-viewer-card__icon-badge">
            <FileText size={22} className="pdf-viewer-card__main-icon" />
          </div>
          <div>
            <div className="pdf-viewer-card__badge-row">
              <span className="badge badge--info">{badgeText}</span>
              {pageCountText && (
                <span className="pdf-viewer-card__page-count">{pageCountText}</span>
              )}
            </div>
            <h3 className="pdf-viewer-card__title">{title}</h3>
            {subtitle && <p className="pdf-viewer-card__subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="pdf-viewer-card__actions">
          <button
            type="button"
            className={`btn ${isOpen ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <>
                <EyeOff size={16} /> Sembunyikan Pembaca
              </>
            ) : (
              <>
                <BookOpen size={16} /> Baca di Website
              </>
            )}
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            title="Buka PDF di tab baru peramban"
          >
            <ExternalLink size={16} /> Buka di Tab Baru
          </a>

          <a
            href={pdfUrl}
            download={downloadName || true}
            className="btn btn-secondary"
            title="Unduh file PDF ke perangkat"
          >
            <Download size={16} /> Unduh PDF
          </a>
        </div>
      </div>

      {isOpen && (
        <div className="pdf-viewer-card__frame-wrap">
          <iframe
            src={pdfUrl}
            title={title}
            className="pdf-viewer-card__iframe"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export default PdfViewer;
