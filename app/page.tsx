"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from './firebase';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    const auth = getAuth(firebaseApp);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user signed in successfully.");
        if (user) {
          router.push('/dashboard/users');
        }
      })
      .catch((error) => {
        console.log("sign-in failed with error code: " + error.code);
        console.log(error.message);
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
      <div className="bg-white p-8 mx-auto py-12 text-center rounded-xl shadow-md">
        <Image
            src="/Pragmatica Banner.png"
            alt='Pragmatica Banner'
            width={360}
            height={120}
            priority
          />

        <form>
          <div className="mx-12 mb-8">
            <label htmlFor="email" className="block text-gray-600 text-lg font-semibold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mx-12 mb-8">
            <label htmlFor="password" className="block text-gray-600 text-lg font-semibold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <button
            type="button" // Change to "submit" if using a form submit
            className="bg-blue-500 hover:bg-blue-400  text-white px-4 py-2 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>

      </div>

    </main>
  )
}