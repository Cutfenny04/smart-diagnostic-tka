import { useEffect } from 'react';

/* Animasi progress bar mengisi dari 0% ke nilai aslinya begitu terlihat di
   layar (scroll into view), pakai IntersectionObserver -- persis logic yang
   dulu ada di initProgressBars() versi vanilla JS. Dipanggil dengan `ready`
   = kondisi data sudah selesai di-render (baru cari .progress-bar__fill
   setelah itu ada di DOM). */
export function useProgressBarAnimation(ready) {
  useEffect(() => {
    if (!ready) return;
    const bars = document.querySelectorAll('.progress-bar__fill[data-progress]');
    if (!bars.length) return;

    if (!('IntersectionObserver' in window)) {
      bars.forEach((bar) => { bar.style.width = bar.getAttribute('data-progress') + '%'; });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.getAttribute('data-progress') + '%';
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach((bar) => observer.observe(bar));
    return () => observer.disconnect();
  }, [ready]);
}
