import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/icon';
import './ResumeCard.css';

function ResumeCard({ item }) {
  return (
    <section className="dashboard-section card-light resume-card" aria-label="Lanjutkan Pelatihan">
      <div className="section-heading">
        <h2 className="section-heading__title">Lanjutkan Pelatihan</h2>
      </div>
      <Link to={item.href} className="resume-card__body">
        <span className="resume-card__icon">{createElement(getIcon(item.icon), { size: 22 })}</span>
        <span className="resume-card__text">
          <span className="resume-card__eyebrow">{item.eyebrow}</span>
          <span className="resume-card__title">{item.title}</span>
          {item.percent !== null && (
            <span className="resume-card__progress">
              <span className="progress-bar progress-bar--sm" role="progressbar" aria-valuenow={item.percent} aria-valuemin="0" aria-valuemax="100" aria-label={'Progress ' + item.title}>
                <span className="progress-bar__fill" data-progress={item.percent} />
              </span>
              <span className="resume-card__percent">{item.percent}%</span>
            </span>
          )}
        </span>
        <span className="resume-card__arrow" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export default ResumeCard;
