import { WORDWALL_STAGES, computeWordwallStage } from '../utils/wordwallStage';
import './WordwallStageChecklist.css';

function WordwallStageChecklist({ item }) {
  const { reachedSteps } = computeWordwallStage(item);

  return (
    <ul className="wordwall-stage-checklist" aria-label="Tahap Wordwall">
      {WORDWALL_STAGES.map((s, i) => {
        const stepNum = i + 1;
        const done = stepNum <= reachedSteps;
        return (
          <li key={s.key} className={'wordwall-stage-checklist__item' + (done ? ' is-done' : '')}>
            <span className="wordwall-stage-checklist__icon" aria-hidden="true">{done ? '✓' : stepNum}</span>
            {s.label}
          </li>
        );
      })}
    </ul>
  );
}

export default WordwallStageChecklist;
