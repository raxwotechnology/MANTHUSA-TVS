"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { useSettings } from '@/lib/useSettings';

export default function LoginPage() {
  const { settings: brand } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaUserId, setMfaUserId] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'mfa' | 'request-reset' | 'reset' | 'request-verification' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const getLandingPath = (user: { role?: string }) =>
    /customer|client/i.test(user.role || '') ? '/account' : '/dashboard';

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('expired') === '1') {
        setError('Your session has expired. Please sign in again.');
      }
    }
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Invalid credentials');
      if (result.mfaRequired) {
        setMfaUserId(result.userId);
        setMode('mfa');
        setMessage('MFA is enabled on your account. Enter your 6-digit code or backup code.');
        return;
      }
      if (!result.access_token || !result.user) throw new Error('The server returned an invalid login response.');
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = getLandingPath(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const completeMfa = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/auth/mfa/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: mfaUserId, code: mfaCode }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Invalid MFA code');
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = getLandingPath(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid MFA verification code.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(getApiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Could not create your account.');
      if (!result.access_token || !result.user) throw new Error('The server returned an invalid registration response.');
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = getLandingPath(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const recover = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const requesting = mode === 'request-reset' || mode === 'request-verification';
      const verifying = mode === 'request-verification' || mode === 'verify';
      const endpoint = verifying
        ? (requesting ? '/auth/request-email-verification' : '/auth/verify-email')
        : (requesting ? '/auth/forgot-password' : '/auth/reset-password');
      const body = requesting ? { email } : (verifying ? { token } : { token, password: newPassword });
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Could not process the request.');
      setMessage(result.message || 'Request completed.');
      if (requesting) {
        setMode(verifying ? 'verify' : 'reset');
      } else {
        setMode('login');
        setToken('');
        setNewPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process the request.');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    setMode('login');
    setError('');
    setMessage('');
    setMfaCode('');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B132B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center" suppressHydrationWarning>
        <div className="w-16 h-16 rounded-2xl bg-white p-1 flex items-center justify-center mx-auto mb-4 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <img src="/logo.jpeg" alt="MANTHUSA TVS" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">
          <span>MANTHUSA TVS</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          Motorcycle Sales Management System Customer & Staff Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-card bg-white dark:bg-[#131F3F] py-8 px-4 shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-800 sm:rounded-3xl sm:px-10">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 text-xs">
            <Link href="/" className="text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
              ← Back to TVS Website
            </Link>
            <Link href="/" className="font-semibold text-red-600 dark:text-red-400 transition-colors hover:text-red-500">
              Showroom Home
            </Link>
          </div>

          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}
          {message && (
            <div role="status" className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-300 font-medium">
              {message}
            </div>
          )}

          {mode === 'login' ? (
            <div className="space-y-5">
              <form className="space-y-4" onSubmit={login}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@manthusatvs.lk"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </label>

                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60 shadow-lg shadow-red-600/30 transition-all hover:scale-102"
                >
                  <span>{loading ? 'Signing in…' : 'Sign in to Portal'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="flex justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('request-reset');
                      setError('');
                      setMessage('');
                    }}
                    className="text-red-600 dark:text-red-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                      setMessage('');
                    }}
                    className="font-semibold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Create Customer Account
                  </button>
                </div>
              </form>
            </div>
          ) : mode === 'signup' ? (
            <form className="space-y-4" onSubmit={register}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create your TVS customer account</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register to track your motorcycle requests, bookings, quotations, and deliveries.
              </p>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full name
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="e.g. Kamal Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone number
                <input
                  type="tel"
                  required
                  minLength={7}
                  placeholder="e.g. 0771234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email address
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm password
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 hover:bg-red-500 p-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60 shadow-lg shadow-red-600/30 transition-all hover:scale-102"
              >
                {loading ? 'Creating account…' : 'Create Customer Account'}
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Already have an account? Sign in
              </button>
            </form>
          ) : mode === 'mfa' ? (
            <form className="space-y-4" onSubmit={completeMfa}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" /> Two-Factor Authentication
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">Enter your 6-digit code or backup code.</p>
              <input
                type="text"
                required
                placeholder="e.g. 123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-center text-lg font-mono tracking-widest text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 hover:bg-red-500 p-3 text-xs font-bold text-white disabled:opacity-60 shadow-lg shadow-red-600/30"
              >
                {loading ? 'Verifying OTP…' : 'Verify & Log In'}
              </button>
              <button type="button" onClick={goToLogin} className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Back to sign in
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={recover}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {mode === 'request-reset' ? 'Reset your password' : mode === 'reset' ? 'Choose a new password' : 'Verify email'}
              </h3>
              {mode === 'request-reset' || mode === 'request-verification' ? (
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Account email
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@salesplus.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </label>
              ) : (
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Token
                  <input
                    required
                    placeholder="e.g. 123456"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] p-3 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
                  />
                </label>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 hover:bg-red-500 p-3 text-xs font-bold text-white disabled:opacity-60 shadow-lg shadow-red-600/30"
              >
                {loading ? 'Please wait…' : 'Submit'}
              </button>
              <button type="button" onClick={goToLogin} className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
