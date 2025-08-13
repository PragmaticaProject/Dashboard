"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from './firebase';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    const auth = getAuth(firebaseApp);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.email + " has signed in successfully.");
        if (user) {
          router.push('/dashboard/profile');
        }
      })
      .catch((error) => {
        console.log("sign-in failed with error code: " + error.code);
        console.log(error.message);
        setErrorMessage("Email or password is incorrect.");
      });
  };

  return (
    <main className="flex items-center h-screen p-12"
      style={{
        backgroundImage: "url('loginBackground.jpg')",
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >

      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <Image
            src="/Pragmatica Banner.png"
            alt="Pragmatica Banner"
            width={360}
            height={120}
            priority
          />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
          <div className="px-2">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="px-2">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 mr-2 inline-flex items-center rounded-md px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="px-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="px-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 active:bg-blue-700"
            >
              Sign in
            </button>
          </div>

          <div className="px-2 text-right">
            <a href="#" className="text-sm text-gray-500 transition hover:text-gray-700">Forgot password?</a>
          </div>
        </form>
      </div>
    </main>
  )
}