import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MentorqueBrand from "../components/MentorqueLogo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(null); // 'USER', 'MENTOR', 'ADMIN'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError("");
    
    // Auto-fill demo credentials based on role
    if (selectedRole === "ADMIN") {
      setEmail("admin@mentorque.com");
      setPassword("Admin@1234");
    } else if (selectedRole === "MENTOR") {
      setEmail("priya@mentor.com");
      setPassword("Pass@1234");
    } else {
      setEmail("alice@example.com");
      setPassword("Pass@1234");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      // Navigate based on actual role from server
      if (user.role === "ADMIN") navigate("/admin", { replace: true });
      else if (user.role === "MENTOR") navigate("/mentor", { replace: true });
      else navigate("/availability", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand Header */}
      <div className="mb-12">
        <MentorqueBrand className="h-10 text-white" />
      </div>

      <div className="w-full max-w-4xl relative">
        {/* Glow effect behind cards */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20 pointer-events-none"></div>

        <div className="bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-12 relative overflow-hidden">
          {/* Main content */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-400 text-lg">
              {!role ? "Select your role to sign in to the portal." : "Sign in to continue."}
            </p>
          </div>

          {!role ? (
            /* Role Selection Screen */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* User Card */}
              <button
                onClick={() => handleRoleSelect("USER")}
                className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-navy-950/50 border border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300"
              >
                <div className="h-16 w-16 mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Mentee</h3>
                <p className="text-sm text-slate-400">Book calls & set requirements</p>
              </button>

              {/* Mentor Card */}
              <button
                onClick={() => handleRoleSelect("MENTOR")}
                className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-navy-950/50 border border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
              >
                <div className="h-16 w-16 mb-4 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Mentor</h3>
                <p className="text-sm text-slate-400">Manage your availability</p>
              </button>

              {/* Admin Card */}
              <button
                onClick={() => handleRoleSelect("ADMIN")}
                className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-navy-950/50 border border-purple-500/20 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300"
              >
                <div className="h-16 w-16 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Admin</h3>
                <p className="text-sm text-slate-400">Match & schedule calls</p>
              </button>
            </div>
          ) : (
            /* Login Form Screen */
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setRole(null)}
                  className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  aria-label="Back to roles"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="flex-1 flex items-center justify-center gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${
                    role === 'ADMIN' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                    role === 'MENTOR' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                    'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                  }`}>
                    {role} LOGIN
                  </span>
                </div>
                <div className="w-9"></div> {/* Spacer for centering */}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm text-red-200">{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${
                    role === 'ADMIN' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500' :
                    role === 'MENTOR' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
                    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In as {role === 'USER' ? 'Mentee' : capitalize(role)}</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer context */}
      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>Mentorque Mentoring Call Scheduling System</p>
      </div>
    </div>
  );
}

function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
