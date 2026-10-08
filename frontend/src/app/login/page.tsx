"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Car, Lock, Mail, ArrowRight } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

export default function LoginPage() {
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

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch(getApiUrl('/auth/login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Invalid credentials');
      if (result.mfaRequired) {
        setMfaUserId(result.userId);
        setMode('mfa');
        setMessage('MFA is enabled on your account. Enter your 6-digit code or backup code.');
        return;
      }
      if (!result.access_token || !result.user) throw new Error('The server returned an invalid login response.');
      localStorage.setItem('token', result.access_token); localStorage.setItem('user', JSON.stringify(result.user)); window.location.href = '/dashboard';
    } catch (err) { setError(err instanceof Error ? err.message : 'Cannot connect to the server.'); }
    finally { setLoading(false); }
  };

  const completeMfa = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch(getApiUrl('/auth/mfa/login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: mfaUserId, code: mfaCode }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Invalid MFA code');
      localStorage.setItem('token', result.access_token); localStorage.setItem('user', JSON.stringify(result.user)); window.location.href = '/dashboard';
    } catch (err) { setError(err instanceof Error ? err.message : 'Invalid MFA verification code.'); }
    finally { setLoading(false); }
  };

  const register = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
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
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot connect to the server.');
    } finally { setLoading(false); }
  };

  const recover = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      const requesting = mode === 'request-reset' || mode === 'request-verification';
      const verifying = mode === 'request-verification' || mode === 'verify';
      const endpoint = verifying ? (requesting ? '/auth/request-email-verification' : '/auth/verify-email') : (requesting ? '/auth/forgot-password' : '/auth/reset-password');
      const body = requesting ? { email } : (verifying ? { token } : { token, password: newPassword });
      const response = await fetch(getApiUrl(endpoint), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Could not process the request.');
      setMessage(result.message || 'Request completed.');
      if (requesting) setMode(verifying ? 'verify' : 'reset'); else { setMode('login'); setToken(''); setNewPassword(''); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not process the request.'); }
    finally { setLoading(false); }
  };

  const goToLogin = () => { setMode('login'); setError(''); setMessage(''); setMfaCode(''); };

  return <div className="min-h-screen bg-[#0B132B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center"><div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl"><Car className="w-8 h-8" /></div><h2 className="text-2xl font-extrabold text-white">Sales<span className="text-emerald-400">Plus</span> VSMS</h2><p className="mt-1 text-xs text-slate-400">Vehicle Sales Management System Customer & Staff Portal</p></div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"><div className="bg-[#131F3F] py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10">
      <div className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4 text-xs">
        <Link href="/" className="text-slate-400 transition-colors hover:text-white">← Back to website</Link>
        <Link href="/" className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300">SalesPlus Home</Link>
      </div>
      {error && <div role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>}
      {message && <div role="status" className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">{message}</div>}
      {mode === 'login' ? <form className="space-y-4" onSubmit={login}>
        <label className="block text-xs font-semibold text-slate-300">Email Address<div className="relative mt-1"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input type="email" required placeholder="e.g. admin@salesplus.com" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-[#0B132B] py-2.5 pl-9 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none placeholder:text-slate-500"/></div></label>
        <label className="block text-xs font-semibold text-slate-300">Password<div className="relative mt-1"><Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input type="password" required placeholder="••••••••" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-[#0B132B] py-2.5 pl-9 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none placeholder:text-slate-500"/></div></label>
        <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white disabled:opacity-60"><span>{loading ? 'Signing in…' : 'Sign in to Dashboard'}</span><ArrowRight className="h-4 w-4"/></button>
        <div className="flex justify-between"><button type="button" onClick={() => { setMode('request-reset'); setError(''); setMessage(''); }} className="text-xs text-emerald-400 hover:text-emerald-300">Forgot password?</button><button type="button" onClick={() => { setMode('request-verification'); setError(''); setMessage(''); }} className="text-xs text-slate-400 hover:text-white">Verify email</button></div>
        <div className="border-t border-slate-700 pt-4 text-center"><span className="text-xs text-slate-400">Are you a customer?</span> <button type="button" onClick={() => { setMode('signup'); setError(''); setMessage(''); }} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">Create an account</button></div>
      </form> : mode === 'signup' ? <form className="space-y-4" onSubmit={register}>
        <h3 className="text-sm font-bold text-white">Create your customer account</h3>
        <p className="text-xs text-slate-400">Register to browse vehicles, compare options, and manage your inquiries.</p>
        <label className="block text-xs font-semibold text-slate-300">Full name<input type="text" required minLength={2} autoComplete="name" placeholder="Your full name" value={name} onChange={event => setName(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"/></label>
        <label className="block text-xs font-semibold text-slate-300">Phone number<input type="tel" required minLength={7} autoComplete="tel" placeholder="e.g. 0771234567" value={phone} onChange={event => setPhone(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"/></label>
        <label className="block text-xs font-semibold text-slate-300">Email address<input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"/></label>
        <label className="block text-xs font-semibold text-slate-300">Password<input type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={event => setPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"/></label>
        <label className="block text-xs font-semibold text-slate-300">Confirm password<input type="password" required minLength={8} autoComplete="new-password" placeholder="Repeat your password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"/></label>
        <button disabled={loading} className="w-full rounded-xl bg-emerald-600 p-3 text-xs font-bold text-white disabled:opacity-60">{loading ? 'Creating account…' : 'Create customer account'}</button>
        <button type="button" onClick={goToLogin} className="w-full text-xs text-slate-400 hover:text-white">Already have an account? Sign in</button>
      </form> : mode === 'mfa' ? <form className="space-y-4" onSubmit={completeMfa}>
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-400"/> Two-Factor Authentication</h3>
        <p className="text-xs text-slate-300">Please enter the 6-digit OTP code from your authenticator app or backup code.</p>
        <input type="text" required placeholder="e.g. 123456" value={mfaCode} onChange={e => setMfaCode(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-center text-lg font-mono tracking-widest text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"/>
        <button disabled={loading} className="w-full rounded-xl bg-emerald-600 p-3 text-xs font-bold text-white disabled:opacity-60">{loading ? 'Verifying OTP…' : 'Verify & Log In'}</button>
        <button type="button" onClick={goToLogin} className="w-full text-xs text-slate-400 hover:text-white">Back to password login</button>
      </form> : <form className="space-y-4" onSubmit={recover}>
        <h3 className="text-sm font-bold">{mode === 'request-reset' ? 'Reset your password' : mode === 'reset' ? 'Choose a new password' : 'Verify your email address'}</h3>
        {mode === 'request-reset' || mode === 'request-verification' ? <><label className="block text-xs font-semibold">Account email<input type="email" required placeholder="e.g. user@salesplus.com" value={email} onChange={event => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-white placeholder:text-slate-500"/></label><p className="text-[11px] text-slate-400">A one-time token will be sent if the account needs this action and email delivery is configured.</p></> : <><label className="block text-xs font-semibold">{mode === 'verify' ? 'Verification token' : 'Reset token'}<input required placeholder="e.g. 123456" value={token} onChange={event => setToken(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-white placeholder:text-slate-500"/></label>{mode === 'reset' && <label className="block text-xs font-semibold">New password<input type="password" minLength={10} required placeholder="At least 10 characters" autoComplete="new-password" value={newPassword} onChange={event => setNewPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#0B132B] p-3 text-white placeholder:text-slate-500"/></label>}</>}
        <button disabled={loading} className="w-full rounded-xl bg-emerald-600 p-3 text-xs font-bold text-white disabled:opacity-60">{loading ? 'Please wait…' : mode === 'request-reset' || mode === 'request-verification' ? 'Send one-time token' : mode === 'verify' ? 'Verify email' : 'Update password'}</button><button type="button" onClick={goToLogin} className="w-full text-xs text-slate-400 hover:text-white">Back to sign in</button>
      </form>}
    </div></div>
  </div>;
}
