import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Inbox, Leaf } from 'lucide-react';
import { fetchSoalByPaket } from '../data/soalData';
import { saveHasil } from '../data/hasilData';
import { isTuntas } from '../utils/scoring';
import AcehMotifDivider from './AcehMotifDivider';
import './NonTkaGame.css';

/* Game Non-TKA pertama (Revisi 8, PIVOT_PLAN.md §C Fase 5). Pilihan ganda
   interaktif berbasis stimulus + ilustrasi, skor dihitung di browser dari
   correctAnswer yang dikirim /api/soal (lihat catatan scope di
   backend/controllers/soal.controller.js). Fase 6: begitu selesai, hasil
   dikirim ke POST /api/hasil-diagnostik supaya muncul di HasilDiagnostik.jsx
   -- kalau request-nya gagal, skor tetap ditampilkan (dihitung lokal),
   cuma diberi catatan bahwa penyimpanannya gagal.

   Nuansa Aceh (lihat PIVOT_PLAN.md §B2): motif dekoratif AcehMotifDivider
   selalu tampil sebagai identitas visual permanen game (bukan konten soal).
   Badge "Konteks Budaya Aceh" HANYA muncul kalau teks soal/stimulus memang
   menyebut sesuatu yang Aceh-spesifik -- sengaja tidak dipaksakan ke semua
   soal, karena sebagian besar dari 90 soal yang diimpor (Fisika/Biologi/
   Kimia) memang konten kurikulum umum, bukan konteks lokal Aceh. */
const ACEH_KEYWORDS = [
  'aceh', 'gayo', 'sigli', 'beulangong', 'meulaboh', 'lhokseumawe', 'sabang',
  'simeulue', 'leuser', 'rencong', 'rumoh', 'saman', 'seudati', 'takengon',
  'gampong', 'meunasah',
];

function hasAcehContext(...texts) {
  const combined = texts.filter(Boolean).join(' ').toLowerCase();
  return ACEH_KEYWORDS.some((kw) => combined.includes(kw));
}

function optionState(optionKey, selectedKey, correctAnswer) {
  if (!selectedKey) return 'idle';
  if (optionKey === correctAnswer) return 'correct';
  if (optionKey === selectedKey) return 'incorrect';
  return 'disabled';
}

function OptionCard({ option, state, onSelect }) {
  return (
    <button
      type="button"
      className={'game-option game-option--' + state}
      onClick={() => onSelect(option.key)}
      disabled={state !== 'idle'}
    >
      <span className="game-option__key">{option.key}</span>
      <span className="game-option__text">{option.text}</span>
      {state === 'correct' && <CheckCircle2 className="game-option__icon" size={20} />}
      {state === 'incorrect' && <XCircle className="game-option__icon" size={20} />}
    </button>
  );
}

const SAVE_NOTE = {
  saving: 'Menyimpan hasil ke riwayat kamu...',
  saved: 'Hasil sudah tersimpan di Dashboard Hasil.',
  error: 'Gagal menyimpan hasil ke server, tapi skor di atas tetap akurat. Coba lagi nanti.',
};

function ResultView({ answers, total, saveStatus, onRestart, onExit }) {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const tuntas = isTuntas(percent);

  return (
    <div className="card-light game-result">
      <AcehMotifDivider className="game-result__motif" />
      <div className="game-result__icon"><Trophy size={32} /></div>
      <h2 className="game-result__title">Diagnostik Selesai</h2>
      <p className="game-result__score">{correctCount} / {total}</p>
      <p className="game-result__percent">{percent}% jawaban benar</p>
      <span className={'badge ' + (tuntas ? 'badge--selesai' : 'badge--belum')}>{tuntas ? 'Tuntas' : 'Belum Tuntas'}</span>
      <p className="game-result__note">{SAVE_NOTE[saveStatus] || ''}</p>
      <div className="game-result__actions">
        <button type="button" className="btn btn-secondary" onClick={onExit}><ArrowLeft size={16} /> Kembali</button>
        <button type="button" className="btn btn-primary" onClick={onRestart}><RotateCcw size={16} /> Ulangi</button>
      </div>
    </div>
  );
}

function NonTkaGame({ paket, onExit }) {
  const [soalList, setSoalList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [saveStatus, setSaveStatus] = useState('saving');

  useEffect(() => {
    fetchSoalByPaket(paket.id).then(setSoalList);
  }, [paket.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentIndex, finished]);

  function resetGame() {
    setCurrentIndex(0);
    setSelectedKey(null);
    setAnswers([]);
    setFinished(false);
    setStartedAt(new Date().toISOString());
  }

  function selectAnswer(key) {
    if (selectedKey) return;
    const current = soalList[currentIndex];
    setSelectedKey(key);
    setAnswers((prev) => [...prev, { soalId: current.id, selectedKey: key, isCorrect: key === current.correctAnswer }]);
  }

  function finishGame(finalAnswers) {
    setFinished(true);
    const total = soalList.length;
    const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
    const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);

    setSaveStatus('saving');
    saveHasil({
      paketId: paket.id,
      score,
      correctCount,
      wrongCount: total - correctCount,
      totalQuestions: total,
      startedAt,
      completedAt: new Date().toISOString(),
    })
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('error'));
  }

  function goNext() {
    if (currentIndex + 1 >= soalList.length) {
      finishGame(answers);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedKey(null);
  }

  if (soalList === null) {
    return (
      <div className="card-light diagnostic-embed">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text" />
      </div>
    );
  }

  if (soalList.length === 0) {
    return (
      <div className="card-light diagnostic-embed">
        <div className="diagnostic-embed__head">
          <h2 className="diagnostic-embed__title">{paket.title}</h2>
          <button type="button" className="btn btn-secondary" onClick={onExit}><ArrowLeft size={16} /> Kembali</button>
        </div>
        <div className="empty-state">
          <div className="empty-state__icon"><Inbox size={28} /></div>
          <h3 className="empty-state__title">Belum ada soal</h3>
          <p className="empty-state__desc">Paket ini belum memiliki butir soal.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return <ResultView answers={answers} total={soalList.length} saveStatus={saveStatus} onRestart={resetGame} onExit={onExit} />;
  }

  const current = soalList[currentIndex];
  const progressPercent = Math.round(((currentIndex + (selectedKey ? 1 : 0)) / soalList.length) * 100);
  const currentIsCorrect = selectedKey ? selectedKey === current.correctAnswer : null;
  const isAcehContext = hasAcehContext(current.question, current.stimulus);

  return (
    <div className="card-light game-panel">
      <AcehMotifDivider className="game-panel__motif" />
      <div className="game-panel__head">
        <button type="button" className="btn btn-secondary" onClick={onExit}><ArrowLeft size={16} /> Kembali</button>
        <span className="game-panel__progress-label">Soal {currentIndex + 1} dari {soalList.length}</span>
      </div>
      <div className="progress-bar progress-bar--sm">
        <span className="progress-bar__fill" style={{ width: progressPercent + '%' }} />
      </div>

      {isAcehContext && (
        <span className="game-panel__aceh-badge"><Leaf size={14} /> Konteks Budaya Aceh</span>
      )}

      {current.stimulus && <p className="game-panel__stimulus">{current.stimulus}</p>}
      {current.image && (
        <img className="game-panel__image" src={current.image} alt={'Ilustrasi soal ' + paket.title} />
      )}

      <h2 className="game-panel__question">{current.question}</h2>

      <div className="game-options">
        {current.options.map((opt) => (
          <OptionCard
            key={opt.key}
            option={opt}
            state={optionState(opt.key, selectedKey, current.correctAnswer)}
            onSelect={selectAnswer}
          />
        ))}
      </div>

      {selectedKey && (
        <div className={'game-feedback ' + (currentIsCorrect ? 'is-correct' : 'is-incorrect')}>
          <p className="game-feedback__title">{currentIsCorrect ? 'Jawaban benar!' : 'Jawaban kurang tepat.'}</p>
          {current.explanation && <p className="game-feedback__explanation">{current.explanation}</p>}
          <button type="button" className="btn btn-primary" onClick={goNext}>
            {currentIndex + 1 >= soalList.length ? 'Lihat Hasil' : 'Lanjut'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default NonTkaGame;
