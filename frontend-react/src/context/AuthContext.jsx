import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(undefined);

/* Fase 5: sumber kebenaran status login sekarang session Supabase (lewat
   supabase-js, yang sudah menyimpan & me-refresh token-nya sendiri), bukan
   lagi localStorage['token'] manual dari Fase 4. getSession() dipanggil
   sekali di awal untuk sesi yang sudah ada (mis. refresh halaman),
   onAuthStateChange() menjaga state ini tetap sinkron setelah itu (login,
   logout, token di-refresh otomatis). */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = belum dicek, null = tidak ada sesi
  const [profile, setProfile] = useState(null); // Fase 6: baris profiles milik guru yang login

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fase 6: sekali sesi ada, ambil data guru dari tabel profiles (RLS
  // profiles_select_own dari Fase 1 yang mengizinkan ini) -- dipakai
  // bersama oleh Topbar (sapaan), Dashboard (sapaan), dan Profil.jsx,
  // supaya cuma satu query per sesi, bukan tiap halaman fetch sendiri.
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    supabase
      .from('profiles')
      .select('nama, nip, email, role, created_at')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (!cancelled) setProfile(data ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading: session === undefined,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() harus dipakai di dalam <AuthProvider>');
  return ctx;
}
