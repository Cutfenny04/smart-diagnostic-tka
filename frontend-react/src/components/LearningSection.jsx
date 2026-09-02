import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  BarChart2,
  Target,
  FileCheck,
} from 'lucide-react';

function LearningSection({ section }) {
  if (!section) return null;

  return (
    <article className="learning-section card-light" id={section.id}>
      <h2 className="learning-section__title">{section.title}</h2>
      {section.lead && <p className="learning-section__lead">{section.lead}</p>}

      {/* 1. Tabel Perbandingan Asesmen Konvensional vs Smart Diagnostic */}
      {section.comparison && section.comparison.rows && (
        <div className="learning-table-wrapper">
          <table className="learning-table">
            <thead>
              <tr>
                <th>Aspek</th>
                <th className="th--conventional">Asesmen Konvensional</th>
                <th className="th--smart">Smart Diagnostic Assessment</th>
              </tr>
            </thead>
            <tbody>
              {section.comparison.rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="td-aspect"><strong>{row.aspect}</strong></td>
                  <td className="td-conv">{row.conventional}</td>
                  <td className="td-smart">
                    <span className="smart-highlight">{row.smart}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Tiga Fungsi Asesmen (Of, For, As Learning) */}
      {section.functions && (
        <div className="functions-grid">
          {section.functions.map((fn, idx) => (
            <div key={idx} className="function-card">
              <span className="function-card__num">{fn.num}</span>
              <h3 className="function-card__name">{fn.name}</h3>
              <p className="function-card__desc">{fn.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. 6 Dimensi HOTS */}
      {section.dimensions && (
        <div className="dimensions-grid">
          {section.dimensions.map((dim) => (
            <div key={dim.num} className="dimension-card">
              <div className="dimension-card__header">
                <span className="dimension-card__num">{dim.num}</span>
                <h3 className="dimension-card__name">{dim.name}</h3>
              </div>
              <p className="dimension-card__desc">{dim.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* 4. Tangga Kognitif LOTS, MOTS, HOTS */}
      {section.cognitiveLevels && (
        <div className="cognitive-tiers">
          {section.cognitiveLevels.map((tier, idx) => (
            <div key={idx} className={`cognitive-tier cognitive-tier--${idx}`}>
              <div className="cognitive-tier__head">
                <span className="cognitive-tier__title">{tier.tier}</span>
                <span className="badge badge--info">{tier.levels}</span>
              </div>
              <p className="cognitive-tier__desc">{tier.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* 5. Tabel Tangga Kognitif Kasus Tekanan */}
      {section.stairsTable && (
        <div className="stairs-table-wrap">
          <div className="stairs-table">
            {section.stairsTable.map((row, idx) => (
              <div key={idx} className={`stairs-row stairs-row--${row.category.toLowerCase()}`}>
                <div className="stairs-row__badge-col">
                  <span className={`badge ${row.category === 'HOTS' ? 'badge--important' : row.category === 'MOTS' ? 'badge--new' : 'badge--info'}`}>
                    {row.level}
                  </span>
                  <span className="stairs-row__tier">{row.category}</span>
                </div>
                <div className="stairs-row__content-col">
                  <p className="stairs-row__question">{row.question}</p>
                  <span className="stairs-row__type">{row.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tujuan TKA */}
      {section.goals && (
        <div className="goals-grid">
          {section.goals.map((g) => (
            <div key={g.num} className="goal-card">
              <span className="goal-card__num">{g.num}</span>
              <div>
                <h3 className="goal-card__title">{g.title}</h3>
                <p className="goal-card__desc">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. Karakteristik Soal TKA */}
      {section.characteristics && (
        <div className="characteristics-box">
          <ul className="characteristics-list">
            {section.characteristics.map((c, i) => (
              <li key={i} className="characteristic-item">
                <CheckCircle2 size={18} className="characteristic-icon" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          {section.quoteNotice && (
            <div className="characteristics-quote">
              <p>"{section.quoteNotice}"</p>
            </div>
          )}
        </div>
      )}

      {/* 8. Alur Kemampuan yang Diukur */}
      {section.flowSteps && (
        <div className="flow-steps-wrapper">
          <div className="flow-steps">
            {section.flowSteps.map((s, i) => (
              <div key={s.step} className="flow-step-item">
                <div className="flow-step-item__marker">{s.step}</div>
                <div className="flow-step-item__content">
                  <strong className="flow-step-item__title">{s.title}</strong>
                  <p className="flow-step-item__desc">{s.desc}</p>
                </div>
                {i < section.flowSteps.length - 1 && (
                  <ArrowRight size={18} className="flow-step-item__arrow" />
                )}
              </div>
            ))}
          </div>
          {section.scopeNote && (
            <div className="scope-note">
              <Target size={18} />
              <span>{section.scopeNote}</span>
            </div>
          )}
        </div>
      )}

      {/* 9. Perbandingan Bukan Sekadar Hafalan vs HOTS TKA */}
      {Array.isArray(section.comparison) && (
        <div className="tka-comparison-grid">
          {section.comparison.map((c, idx) => (
            <div key={idx} className={`tka-comp-card tka-comp-card--${idx === 0 ? 'hafalan' : 'hots'}`}>
              <h3 className="tka-comp-card__title">{c.type}</h3>
              <ul className="tka-comp-card__list">
                {c.points.map((p, pIdx) => (
                  <li key={pIdx}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 10. Taksonomi Bloom Revisi C1-C6 */}
      {section.levels && (
        <div className="bloom-levels-list">
          {section.levels.map((lvl) => (
            <div key={lvl.code} className={`bloom-card bloom-card--${lvl.code.toLowerCase()}`}>
              <div className="bloom-card__head">
                <span className="bloom-card__code">{lvl.code}</span>
                <div>
                  <h3 className="bloom-card__name">{lvl.name}</h3>
                  <span className="bloom-card__tier">{lvl.tier}</span>
                </div>
              </div>
              <p className="bloom-card__desc">{lvl.desc}</p>
              <div className="bloom-card__kko">
                <strong>Contoh KKO IPA:</strong> {lvl.kko}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning Box */}
      {section.warningBox && (
        <div className="warning-callout">
          <div className="warning-callout__icon"><AlertTriangle size={20} /></div>
          <div>
            <h4 className="warning-callout__title">{section.warningBox.title}</h4>
            <p className="warning-callout__text">{section.warningBox.text}</p>
          </div>
        </div>
      )}

      {/* 11. Komponen Indikator ABCD */}
      {section.abcdComponents && (
        <div className="abcd-grid">
          {section.abcdComponents.map((item, idx) => (
            <div key={idx} className="abcd-card">
              <span className="abcd-card__key">{item.key}</span>
              <h3 className="abcd-card__name">{item.name}</h3>
              <p className="abcd-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {section.indicatorExample && (
        <div className="indicator-example-box">
          <span className="indicator-example-box__subject"><FileCheck size={16} /> {section.indicatorExample.subject}</span>
          <p className="indicator-example-box__text">{section.indicatorExample.text}</p>
        </div>
      )}

      {/* 12. Tabel KKO */}
      {section.kkoTable && (
        <div className="kko-table-wrapper">
          <table className="kko-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Kemampuan</th>
                <th>Contoh Kata Kerja Operasional (IPA)</th>
                <th>Kategori</th>
              </tr>
            </thead>
            <tbody>
              {section.kkoTable.map((row) => (
                <tr key={row.level} className={`tr--${row.category.toLowerCase()}`}>
                  <td><strong>{row.level}</strong></td>
                  <td>{row.ability}</td>
                  <td>{row.kko}</td>
                  <td>
                    <span className={`badge ${row.category === 'HOTS' ? 'badge--important' : row.category === 'MOTS' ? 'badge--new' : 'badge--info'}`}>
                      {row.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 13. 9 Bentuk Stimulus */}
      {section.stimulusTypes && (
        <div className="stimulus-types-grid">
          {section.stimulusTypes.map((st) => (
            <div key={st.num} className="stimulus-card">
              <div className="stimulus-card__header">
                <span className="stimulus-card__num">{st.num}</span>
                <span className="badge badge--info">{st.badge}</span>
              </div>
              <h3 className="stimulus-card__title">{st.name}</h3>
              <p className="stimulus-card__desc">{st.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* 14. 4 Prinsip Kunci Stimulus */}
      {section.principles && (
        <div className="principles-list">
          {section.principles.map((pr) => (
            <div key={pr.num} className="principle-item">
              <span className="principle-item__num">{pr.num}</span>
              <div className="principle-item__content">
                <h3 className="principle-item__title">{pr.title}</h3>
                <p className="principle-item__desc">{pr.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 15. Langkah ke Praktik */}
      {section.stepsToPractice && (
        <div className="practice-steps-grid">
          {section.stepsToPractice.map((stp, idx) => (
            <div key={idx} className="practice-step-card">
              <span className="practice-step-card__order">{stp.order}</span>
              <h3 className="practice-step-card__action">{stp.action}</h3>
              <p className="practice-step-card__desc">{stp.desc}</p>
            </div>
          ))}
        </div>
      )}

      {section.keyTakeaway && (
        <div className="key-takeaway-box">
          <Lightbulb size={20} className="key-takeaway-box__icon" />
          <p className="key-takeaway-box__text">{section.keyTakeaway}</p>
        </div>
      )}
    </article>
  );
}

export default LearningSection;
