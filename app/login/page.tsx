// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUser } from '../context/UserContext';

// export default function LoginPage() {
//   const router = useRouter();
//   const { setUser } = useUser();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || 'Invalid credentials');
//         setLoading(false);
//         return;
//       }

//       // ✅ Save logged-in user info to localStorage
//       localStorage.setItem('user', JSON.stringify(data.user));
      
//       // ✅ Update UserContext immediately
//       setUser(data.user);
      
//       // ✅ Dispatch custom event to notify other components
//       window.dispatchEvent(new CustomEvent('userUpdated'));

//       // ✅ Redirect to dashboard
//       router.push('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Login
//         </h2>

//         {error && (
//           <p className="text-red-600 text-center text-sm mb-3">{error}</p>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 text-sm mb-1">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               placeholder="Enter username"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm mb-1">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               placeholder="Enter password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://api.jpf-portal-api.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // ✅ Save logged-in user info to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Update UserContext immediately
      setUser(data.user);

      // ✅ Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('userUpdated'));

      // ✅ Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-[#00b4d8] tracking-wide">
          Jayaprada Foundation
          
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm font-medium text-center py-2 rounded-lg mb-5 border border-red-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-200 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Jayaprada Foundation. All rights reserved.
        </p>
      </div>
    </div>
  );
}
