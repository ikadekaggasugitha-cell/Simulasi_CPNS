import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Cloud,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import { useExamContext } from '../context/ExamContext';

interface AuthViewProps {
  mode: 'login' | 'register';
}

export const EmailVerificationGate: React.FC = () => {
  const { currentUser, resendVerification, reloadVerification, logout, error } =
    useExamContext();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setChecking(true);
    setNotice(null);
    const verified = await reloadVerification();
    if (!verified) {
      setNotice(
        'Status email masih belum terverifikasi. Pastikan Anda telah mengklik tautan verifikasi di kotak masuk atau folder Spam.'
      );
    }
    setChecking(false);
  };

  const handleResend = async () => {
    setResending(true);
    setNotice(null);
    try {
      await resendVerification();
      setNotice('Tautan verifikasi baru telah dikirim ke alamat email Anda.');
    } catch {
      // handled in context error
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-white">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Verifikasi Email Akun Cloud
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              Konfirmasi Alamat Email Anda
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Akun <strong className="text-slate-900">{currentUser?.email}</strong> telah terdaftar
          permanen di cloud. Untuk melindungi riwayat ujian dan keamanan data, silakan buka
          tautan verifikasi yang telah dikirim ke email Anda.
        </p>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900"
          >
            {notice}
          </div>
        )}

        <div className="space-y-2.5">
          <button
            type="button"
            disabled={checking}
            onClick={handleCheckStatus}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>
              {checking ? 'Memeriksa status...' : 'Saya Sudah Verifikasi — Masuk ke Portal'}
            </span>
          </button>

          <button
            type="button"
            disabled={resending}
            onClick={handleResend}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>{resending ? 'Mengirim ulang...' : 'Kirim Ulang Email Verifikasi'}</span>
          </button>

          <button
            type="button"
            onClick={() => void logout()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Keluar &amp; Gunakan Akun Lain (atau Masuk dengan Google)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuthView: React.FC<AuthViewProps> = ({ mode }) => {
  const {
    navigate,
    usingFirebase,
    login,
    loginWithGoogle,
    register,
    authSubmitting,
    error,
    clearError,
    bankStats,
  } = useExamContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isRegister = mode === 'register';

  useEffect(() => {
    setLocalError(null);
    clearError();
  }, [mode, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError('Alamat email wajib diisi.');
      return;
    }

    if (isRegister) {
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        setLocalError('Nama lengkap minimal 2 karakter.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Kata sandi minimal 6 karakter.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      await register({ name: trimmedName, email: trimmedEmail, password });
      return;
    }

    if (!password) {
      setLocalError('Kata sandi wajib diisi.');
      return;
    }
    await login({ email: trimmedEmail, password });
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Left Institutional Info Panel */}
        <aside className="lg:col-span-5 bg-blue-950 text-white p-7 sm:p-8 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white">
                <Award className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold tracking-tight">CAT ASN Nusantara</p>
                <p className="text-xs text-blue-200">Simulasi SKD &amp; SKB CPNS</p>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                Portal Simulasi CAT CPNS Terisolasi per Akun
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Akun peserta, progres pengerjaan, skor Passing Grade, dan riwayat ujian SKD maupun SKB tersimpan permanen dan dapat dibuka kembali kapan saja.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-blue-100">
              <div className="flex items-start gap-2.5">
                <Cloud className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-white">Akun &amp; Riwayat Permanen:</strong> Daftar sekali, masuk kapan saja tanpa kehilangan riwayat sesi ujian Anda.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-white">Privasi Data Multi-User:</strong> Sesi ujian dan hasil evaluasi terisolasi ketat khusus pemilik akun.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-white">Soal HOTS BKN Lengkap:</strong> TWK Penalaran Kasus, TIU Verbal-Numerik-Figural (SVG), TKP, dan SKB IT.
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/15 pt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-blue-200">Bank Soal SKD</p>
              <p className="text-base font-bold font-mono tabular-nums text-white">
                {bankStats ? bankStats.skdTotal.toLocaleString('id-ID') : '1.260'} Soal
              </p>
            </div>
            <div>
              <p className="text-blue-200">Bank Soal SKB IT</p>
              <p className="text-base font-bold font-mono tabular-nums text-white">
                {bankStats ? bankStats.skbTotal.toLocaleString('id-ID') : '200'} Soal
              </p>
            </div>
          </div>
        </aside>

        {/* Right Form Panel */}
        <main className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-center">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                {isRegister ? 'Pendaftaran Peserta Baru' : 'Autentikasi Peserta'}
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                {isRegister ? 'Buat Akun Simulasi' : 'Masuk ke Portal CAT'}
              </h2>
              <p className="text-sm text-slate-600">
                {isRegister
                  ? 'Daftarkan akun pribadi Anda agar seluruh riwayat latihan SKD & SKB tersimpan permanen di cloud.'
                  : 'Masuk dengan akun Anda untuk melanjutkan simulasi SKD, SKB, dan membuka riwayat evaluasi pribadi.'}
              </p>
            </div>

            {displayError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 leading-relaxed"
              >
                {displayError}
              </div>
            )}

            {usingFirebase && (
              <>
                <button
                  type="button"
                  disabled={authSubmitting}
                  onClick={() => void loginWithGoogle()}
                  data-testid="google-signin-button"
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  <span>
                    {authSubmitting
                      ? 'Menghubungkan ke Google...'
                      : isRegister
                      ? 'Daftar Cepat dengan Google (Instan & Permanen)'
                      : 'Masuk dengan Google'}
                  </span>
                </button>

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="mx-3 shrink-0 text-xs font-medium text-slate-400">
                    atau gunakan email &amp; kata sandi
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isRegister && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-name"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="auth-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegister ? 'Minimal 6 karakter' : 'Masukkan kata sandi'}
                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-confirm-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="auth-confirm-password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authSubmitting}
                data-testid={isRegister ? 'register-submit' : 'login-submit'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                {isRegister ? (
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                )}
                <span>
                  {authSubmitting
                    ? 'Memproses...'
                    : isRegister
                    ? 'Buat Akun & Masuk'
                    : 'Masuk ke Portal'}
                </span>
              </button>
            </form>

            <div className="border-t border-slate-200 pt-4 flex items-center justify-between gap-2 text-xs text-slate-600">
              <span>
                {isRegister ? 'Sudah memiliki akun?' : 'Belum memiliki akun peserta?'}
              </span>
              <button
                type="button"
                onClick={() => navigate(isRegister ? '/login' : '/register')}
                className="font-semibold text-blue-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded"
              >
                {isRegister ? 'Masuk di sini' : 'Daftar akun baru'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
