import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, FileCheck } from 'lucide-react';
import { loadChecklistState, saveChecklistState } from '../data/materiData';

function ReflectionChecklist({ items = [], guruId, materiId, onChecklistChange }) {
  const [checkedState, setCheckedState] = useState({});

  useEffect(() => {
    if (!materiId) return;
    const saved = loadChecklistState(guruId, materiId);
    setCheckedState(saved);
  }, [guruId, materiId]);

  function handleToggle(itemId) {
    const nextState = {
      ...checkedState,
      [itemId]: !checkedState[itemId],
    };
    setCheckedState(nextState);
    saveChecklistState(guruId, materiId, nextState);

    if (onChecklistChange) {
      const checkedCount = items.filter((it) => nextState[it.id]).length;
      onChecklistChange(checkedCount, items.length);
    }
  }

  const completedCount = items.filter((it) => checkedState[it.id]).length;
  const isAllChecked = items.length > 0 && completedCount === items.length;

  return (
    <div className="reflection-box card-light" aria-label="Checklist Refleksi Mandiri">
      <div className="reflection-box__header">
        <div className="reflection-box__title-wrap">
          <FileCheck size={24} className="reflection-box__icon" />
          <div>
            <h3 className="reflection-box__title">Refleksi Pemahaman Mandiri</h3>
            <p className="reflection-box__subtitle">
              Centang setiap poin refleksi berikut untuk mengonfirmasi penguasaan materi Anda:
            </p>
          </div>
        </div>
        <span className={`badge ${isAllChecked ? 'badge--selesai' : completedCount > 0 ? 'badge--sedang' : 'badge--belum'}`}>
          {completedCount} / {items.length} Refleksi
        </span>
      </div>

      <ul className="reflection-list" role="list">
        {items.map((item) => {
          const isChecked = Boolean(checkedState[item.id]);
          return (
            <li
              key={item.id}
              className={`reflection-item ${isChecked ? 'is-checked' : ''}`}
              onClick={() => handleToggle(item.id)}
            >
              <button
                type="button"
                className="reflection-item__checkbox"
                aria-checked={isChecked}
                role="checkbox"
                aria-label={item.text}
              >
                {isChecked ? (
                  <CheckCircle2 size={20} className="reflection-item__check-icon" />
                ) : (
                  <Circle size={20} className="reflection-item__circle-icon" />
                )}
              </button>
              <span className="reflection-item__text">{item.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ReflectionChecklist;
