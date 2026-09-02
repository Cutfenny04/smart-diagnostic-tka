import { Landmark, Sparkles } from 'lucide-react';

function AcehCallout({ example }) {
  if (!example) return null;

  return (
    <div className="aceh-callout card-light" aria-label="Contoh Kontekstual Berbasis Kearifan Lokal Aceh">
      <div className="aceh-callout__badge-row">
        <span className="badge badge--info aceh-callout__badge">
          <Landmark size={13} /> {example.badge || 'Contoh Kontekstual Pembelajaran'}
        </span>
        <span className="aceh-callout__tag">
          <Sparkles size={13} /> Kontekstualisasi IPA &amp; Budaya Aceh
        </span>
      </div>

      <h3 className="aceh-callout__title">{example.title}</h3>

      {example.description && (
        <p className="aceh-callout__desc">{example.description}</p>
      )}

      {example.conventionalExample && example.diagnosticExample && (
        <div className="aceh-callout__compare-grid">
          <div className="aceh-callout__compare-item aceh-callout__compare-item--conv">
            <span className="aceh-callout__compare-label">{example.conventionalExample.label}</span>
            <p className="aceh-callout__compare-text">{example.conventionalExample.text}</p>
          </div>
          <div className="aceh-callout__compare-item aceh-callout__compare-item--diag">
            <span className="aceh-callout__compare-label">{example.diagnosticExample.label}</span>
            <p className="aceh-callout__compare-text">{example.diagnosticExample.text}</p>
          </div>
        </div>
      )}

      {example.examplesBySubject && (
        <div className="aceh-callout__subject-grid">
          {example.examplesBySubject.map((item, idx) => (
            <div key={idx} className="aceh-callout__subject-card">
              <div className="aceh-callout__subject-head">
                <span className="badge badge--important">{item.subject}</span>
                <span className="aceh-callout__subject-topic">{item.topic}</span>
              </div>
              <p className="aceh-callout__subject-context">{item.context}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AcehCallout;
