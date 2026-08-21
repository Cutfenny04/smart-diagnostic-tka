import { useEffect, useState } from 'react';
import {
  ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Inbox,
  Leaf, Compass, Star, Lightbulb, Maximize, X, Volume2, VolumeX,
} from 'lucide-react';
import { fetchSoalByPaket } from '../data/soalData';
import { saveHasil } from '../data/hasilData';
import { isTuntas } from '../utils/scoring';
import { useAuth } from '../context/AuthContext';
import { useGameSounds } from '../hooks/useGameSounds';
import CardCornerFrame from './CardCornerFrame';
import './NonTkaGame.css';

/* Game Non-TKA "Ekspedisi Sains Aceh" (Revisi 8 Fase 5, redesign UI
   2026-08-15 -- lihat PIVOT_PLAN.md §C Fase 5). Pilihan ganda interaktif
   berbasis stimulus + ilustrasi, skor dihitung di browser dari
   correctAnswer yang dikirim /api/soal (lihat catatan scope di
   backend/controllers/soal.controller.js). Fase 6: begitu selesai, hasil
   dikirim ke POST /api/hasil-diagnostik supaya muncul di HasilDiagnostik.jsx
   -- kalau request-nya gagal, skor tetap ditampilkan (dihitung lokal),
   cuma diberi catatan bahwa penyimpanannya gagal.

   Redesign 2026-08-15: tampilan diubah jadi mini educational game (HUD,
   Question Board, panel Pembahasan terpisah) TANPA mengubah state machine
   di bawah ini sama sekali -- selectAnswer/finishGame/goNext/resetGame dan
   kapan jawaban terungkap (klik = langsung reveal) persis seperti
   sebelumnya, sesuai arahan pengguna untuk tidak menyentuh logic yang
   sudah terbukti jalan.

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

function hotsBadgeClass(level) {
  return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}

/* Background "scene" (foto ilustrasi) + aset "kit kayu" & maskot -- semua
   diekstrak dari file-file di folder yang sama (lihat PIVOT_PLAN redesign
   2026-08-15/16). Dua file "Untitled design (2/3).svg" aslinya bukan aset
   siap-pakai satu gambar utuh, melainkan kumpulan 10-14 elemen Canva
   terpisah yang digabung jadi satu file 7-15MB -- masing-masing elemen
   diekstrak sekali lalu disimpan sebagai file PNG bersih di folder yang
   sama (arahan pengguna 2026-08-16: "pakai semuanya", termasuk kit tombol
   kayu bergaya kartun & kedua karakter maskot meski gayanya beda dari
   flat design aplikasi ini). encodeURI supaya spasi di nama file valid
   sebagai URL. */
const BG_GAME = encodeURI('/assets/assets bank soal non tka/TV - 2.png');
const BG_RESULT = encodeURI('/assets/assets bank soal non tka/desa.png.png');
const LANDMARK = encodeURI('/assets/assets bank soal non tka/rumoh-aceh-ilustrasi.png');
const WOOD_BOARD = encodeURI('/assets/assets bank soal non tka/wood-board-blank.png');
const SIGN_BACK = encodeURI('/assets/assets bank soal non tka/sign-back.png');
const SIGN_NEXT = encodeURI('/assets/assets bank soal non tka/sign-next.png');
const MASCOT_ALT = encodeURI('/assets/assets bank soal non tka/mascot-anak-1.png');

/* Tombol papan kayu gantung (teks "BACK"/"NEXT" sudah baku di dalam
   gambarnya, tidak bisa diganti per-konteks) -- makna sebenarnya untuk
   screen reader tetap dikirim lewat aria-label dinamis (mis. "Lihat hasil
   ekspedisi"), bukan cuma ikut teks visual di gambar. */
function SignButton({ src, label, onClick, className }) {
  return (
    <button type="button" className={'sign-btn' + (className ? ' ' + className : '')} onClick={onClick} aria-label={label}>
      <img src={src} alt="" aria-hidden="true" />
    </button>
  );
}

function optionState(optionKey, selectedKey, correctAnswer) {
  if (!selectedKey) return 'idle';
  if (optionKey === correctAnswer) return 'correct';
  if (optionKey === selectedKey) return 'incorrect';
  return 'disabled';
}

/* Tidak ada field tabel terstruktur di data soal (lihat audit di
   PIVOT_PLAN.md) -- satu-satunya kasus "tabel" yang benar-benar ada
   diimpor sebagai teks biasa berisi newline (backend/scripts/
   import_soal_non_tka.js, stimulus fisika soal ke-2: "Tabel Besaran
   Pokok...:\n1. Panjang — Meter\n..."). Baris pertama diperlakukan sebagai
   judul/caption, sisanya sebagai daftar rapi -- generik untuk stimulus
   multi-baris apa pun, bukan hardcode ke satu soal. */
function StimulusBlock({ stimulus }) {
  if (!stimulus) return null;
  const lines = stimulus.split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length > 1) {
    const [caption, ...rows] = lines;
    return (
      <div className="game-stimulus game-stimulus--table">
        <p className="game-stimulus__caption">{caption}</p>
        <div className="game-stimulus__table-scroll">
          <ol className="game-stimulus__list">
            {rows.map((line, i) => <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>)}
          </ol>
        </div>
      </div>
    );
  }

  return <blockquote className="game-stimulus game-stimulus--prose">{stimulus}</blockquote>;
}

/* key={current.id} dari pemanggil supaya state lightbox reset tiap ganti
   soal (bukan nyangkut terbuka pas next question). */
function GameImage({ src, alt }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  return (
    <>
      <button type="button" className="game-image" onClick={() => setOpen(true)}>
        <img className="game-image__img" src={src} alt={alt} />
        <span className="game-image__zoom-hint"><Maximize size={13} /> Perbesar</span>
      </button>
      {open && (
        <div className="game-image-lightbox" onClick={() => setOpen(false)}>
          <button type="button" className="game-image-lightbox__close" aria-label="Tutup gambar" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
          <img className="game-image-lightbox__img" src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

function GameHud({ paket, currentNumber, total, progressPercent, correctSoFar, onExit, muted, onToggleMuted }) {
  const { profile } = useAuth();
  const profileName = profile?.nama || 'Guru';
  const profileInitial = profileName.charAt(0).toUpperCase();
  const showDots = total > 0 && total <= 8;

  return (
    <div className="game-hud">
      <SignButton src={SIGN_BACK} label="Kembali ke daftar paket soal" onClick={onExit} className="game-hud__back" />

      <button
        type="button"
        className="btn-icon game-hud__mute-btn"
        onClick={onToggleMuted}
        aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'}
        title={muted ? 'Aktifkan suara' : 'Matikan suara'}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <div className="game-hud__identity">
        <span className="game-hud__avatar" aria-hidden="true">{profileInitial}</span>
        <div className="game-hud__identity-text">
          <span className="game-hud__paket-title">{paket.title}</span>
          <span className="badge badge--info">{paket.subject}</span>
        </div>
      </div>

      <div className="game-hud__progress">
        <div className="game-hud__progress-top">
          <span className="game-hud__eyebrow"><Compass size={12} /> Tantangan</span>
          <span className="game-hud__count">{String(currentNumber).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span className="game-hud__stars"><Star size={13} /> {correctSoFar}</span>
        </div>
        <div className="progress-bar progress-bar--sm game-hud__bar">
          <span className="progress-bar__fill" style={{ width: progressPercent + '%' }} />
        </div>
        {showDots && (
          <div className="game-hud__dots" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={'game-hud__dot' + (i < currentNumber - 1 ? ' is-done' : i === currentNumber - 1 ? ' is-current' : '')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* landmark/mascot cuma boleh dipasang di scene yang konten utamanya PASTI
   punya ruang kosong di sekitarnya (kartu terpusat dengan max-width, seperti
   ResultView) -- lihat catatan penempatan di NonTkaGame.css. Di layar
   bermain, tinggi Question Board berubah-ubah (tergantung stimulus/gambar),
   jadi dua elemen dekoratif itu TIDAK dipasang di sana supaya tidak berisiko
   ketiban/menutupi tombol jawaban atau tombol Lanjut. */
function GameScene({ background, className, landmark, mascot, children }) {
  return (
    <div className={'game-scene' + (className ? ' ' + className : '')} style={{ backgroundImage: `url("${background}")` }}>
      <div className="game-scene__overlay" aria-hidden="true" />
      {landmark && <img className="game-scene__landmark" src={landmark} alt="" aria-hidden="true" />}
      {mascot && <img className="game-scene__mascot" src={mascot} alt="" aria-hidden="true" />}
      <div className="game-scene__content">{children}</div>
    </div>
  );
}

function AnswerCard({ option, state, onSelect }) {
  return (
    <button
      type="button"
      className={'answer-card answer-card--' + state}
      onClick={() => onSelect(option.key)}
      disabled={state !== 'idle'}
    >
      <span className="answer-card__key">{option.key}</span>
      <span className="answer-card__text">{option.text}</span>
      {state === 'correct' && <CheckCircle2 className="answer-card__icon" size={20} />}
      {state === 'incorrect' && <XCircle className="answer-card__icon" size={20} />}
    </button>
  );
}

function FeedbackPanel({ isCorrect, correctAnswer, explanation, isLast, onNext }) {
  return (
    <div className={'feedback-panel ' + (isCorrect ? 'is-correct' : 'is-incorrect')}>
      <div className="feedback-panel__head">
        {isCorrect ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
        <p className="feedback-panel__title">{isCorrect ? 'Jawaban benar!' : 'Jawaban kurang tepat.'}</p>
      </div>
      {!isCorrect && (
        <p className="feedback-panel__correction">Jawaban yang benar: <strong>{correctAnswer}</strong></p>
      )}
      {explanation && (
        <div className="pembahasan-card">
          <div className="pembahasan-card__head"><Lightbulb size={16} /> Pembahasan</div>
          <p className="pembahasan-card__text">{explanation}</p>
        </div>
      )}
      <SignButton
        src={SIGN_NEXT}
        label={isLast ? 'Lihat hasil ekspedisi' : 'Lanjut ke tantangan berikutnya'}
        onClick={onNext}
        className="feedback-panel__next"
      />
    </div>
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
    <GameScene background={BG_RESULT} className="game-scene--result" landmark={LANDMARK} mascot={MASCOT_ALT}>
      <div className="game-result">
        <CardCornerFrame />
        <div className="game-result__icon"><Trophy size={32} /></div>
        <span className="game-result__eyebrow">Ekspedisi Selesai</span>
        <h2 className="game-result__title">Sains Aceh</h2>
        <p className="game-result__score">{correctCount} / {total}</p>
        <p className="game-result__percent">{percent}% jawaban benar</p>
        <span className={'badge ' + (tuntas ? 'badge--selesai' : 'badge--belum')}>{tuntas ? 'Tuntas' : 'Belum Tuntas'}</span>
        <p className="game-result__note">{SAVE_NOTE[saveStatus] || ''}</p>
        <div className="game-result__actions">
          <SignButton src={SIGN_BACK} label="Kembali ke daftar paket soal" onClick={onExit} />
          <button type="button" className="btn btn-primary" onClick={onRestart}><RotateCcw size={16} /> Ulangi</button>
        </div>
      </div>
    </GameScene>
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
  const { muted, toggleMuted, playClick, playCorrect, playIncorrect, playComplete } = useGameSounds();

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
    const isCorrect = key === current.correctAnswer;
    setSelectedKey(key);
    setAnswers((prev) => [...prev, { soalId: current.id, selectedKey: key, isCorrect }]);
    if (isCorrect) playCorrect(); else playIncorrect();
  }

  function finishGame(finalAnswers) {
    setFinished(true);
    playComplete();
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
    playClick();
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
  const currentNumber = currentIndex + 1;
  const progressPercent = Math.round(((currentIndex + (selectedKey ? 1 : 0)) / soalList.length) * 100);
  const currentIsCorrect = selectedKey ? selectedKey === current.correctAnswer : null;
  const isAcehContext = hasAcehContext(current.question, current.stimulus);
  const correctSoFar = answers.filter((a) => a.isCorrect).length;
  const hasImage = Boolean(current.image);

  return (
    <GameScene background={BG_GAME}>
      <GameHud
        paket={paket}
        currentNumber={currentNumber}
        total={soalList.length}
        progressPercent={progressPercent}
        correctSoFar={correctSoFar}
        onExit={onExit}
        muted={muted}
        onToggleMuted={toggleMuted}
      />

      <div className="question-board">
        <div className={'question-board__inner' + (hasImage ? ' question-board__inner--split' : '')}>
          <CardCornerFrame />

          <div className="question-board__header">
            <div className="question-board__eyebrow-wrap">
              <img className="question-board__eyebrow-board" src={WOOD_BOARD} alt="" aria-hidden="true" />
              <span className="question-board__eyebrow">Tantangan {String(currentNumber).padStart(2, '0')}</span>
            </div>
            <div className="question-board__badges">
              <span className="badge badge--info">{paket.subject}</span>
              <span className={'badge ' + hotsBadgeClass(paket.hotsLevel)}>{paket.hotsLevel}</span>
              {isAcehContext && <span className="game-panel__aceh-badge"><Leaf size={14} /> Konteks Budaya Aceh</span>}
            </div>
          </div>

          <div className="question-board__stimulus-col">
            <StimulusBlock stimulus={current.stimulus} />
            {hasImage && (
              <GameImage key={current.id} src={current.image} alt={'Ilustrasi Tantangan ' + currentNumber + ' - ' + paket.title} />
            )}
          </div>

          <div className="question-board__question-col">
            <h2 className="question-board__question">{current.question}</h2>

            <div className="game-options">
              {current.options.map((opt) => (
                <AnswerCard
                  key={opt.key}
                  option={opt}
                  state={optionState(opt.key, selectedKey, current.correctAnswer)}
                  onSelect={selectAnswer}
                />
              ))}
            </div>

            {selectedKey && (
              <FeedbackPanel
                isCorrect={currentIsCorrect}
                correctAnswer={current.correctAnswer}
                explanation={current.explanation}
                isLast={currentNumber >= soalList.length}
                onNext={goNext}
              />
            )}
          </div>
        </div>
      </div>
    </GameScene>
  );
}

export default NonTkaGame;
