import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import './TrainingFlow.css';

const STATUS_LABEL = { selesai: 'Selesai', sedang: 'Sedang Berjalan', belum: 'Belum Dimulai' };

function SubStep({ step }) {
  if (!step.trackable) {
    return (
      <li className="training-flow__substep is-external">
        <span className="training-flow__substep-icon" aria-hidden="true">↗</span>
        {step.label}
      </li>
    );
  }
  return (
    <li className={'training-flow__substep' + (step.done ? ' is-done' : ' is-pending')}>
      <span className="training-flow__substep-icon" aria-hidden="true">{step.done ? '✓' : '○'}</span>
      {step.label}
    </li>
  );
}

function StageItem({ stage, isCurrent }) {
  return (
    <li className={'training-flow__item is-' + stage.status + (isCurrent ? ' is-current' : '')}>
      <span className="training-flow__marker" aria-hidden="true">
        {stage.status === 'selesai' ? <Check size={16} /> : stage.order}
      </span>
      <div className="training-flow__body">
        <div className="training-flow__head">
          <span className="training-flow__title">{stage.title}</span>
          {stage.status !== 'info' && (
            <span className={'badge badge--' + stage.status}>{STATUS_LABEL[stage.status]}</span>
          )}
        </div>
        <p className="training-flow__note">{stage.note}</p>
        {stage.subSteps.length > 0 && (
          <ul className="training-flow__substeps">
            {stage.subSteps.map((s, i) => <SubStep key={i} step={s} />)}
          </ul>
        )}
        <Link to={stage.href} className="training-flow__link">
          {isCurrent ? 'Lanjutkan di sini' : 'Buka halaman'} →
        </Link>
      </div>
    </li>
  );
}

function TrainingFlow({ stages, currentStage }) {
  return (
    <section className="dashboard-section card-light training-flow" aria-label="Alur Pelatihan">
      <div className="section-heading">
        <h2 className="section-heading__title">Alur Pelatihan Anda</h2>
        <p className="training-flow__desc">
          Ikuti langkah berikut dari awal sampai akhir: baca panduan penggunaan dan pelajari materi, buat dan
          daftarkan aktivitas Wordwall (TKA), kerjakan latihan Smart Diagnostic (Non-TKA), lalu pantau progress Anda.
        </p>
      </div>
      <ol className="training-flow__list">
        {stages.map((stage) => (
          <StageItem key={stage.id} stage={stage} isCurrent={stage.id === currentStage.id} />
        ))}
      </ol>
    </section>
  );
}

export default TrainingFlow;
