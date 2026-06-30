import { useState } from "react";
import { auth, googleProvider as provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Auth Exception:", error);
      alert("Authentication drop. Check configuration maps.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-700 selection:bg-indigo-100">
      
      {/* Light Informational Branding Panel */}
      <div className="md:w-1/2 bg-white border-r border-slate-200/80 p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-indigo-600 text-white w-6 h-6 rounded-md flex items-center justify-center font-black text-xs shadow-sm">
            ⏳
          </div>
          <span className="text-[10px] font-black tracking-wider text-indigo-600 uppercase">
            Operations Gate
          </span>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            The Last-Minute <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Life Saver Framework.
            </span>
          </h1>
          <p className="text-slate-500 text-xs font-medium leading-relaxed">
            An elegant task management engine executing backend calendar synchronization loops and proactive tracking workflows.
          </p>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[10px] font-black tracking-wider text-slate-400 uppercase">
            <div className="flex items-center gap-2"><span className="text-indigo-600">✓</span> Endpoint Data Integration</div>
            <div className="flex items-center gap-2"><span className="text-indigo-600">✓</span> Bilingual Voice Support</div>
            <div className="flex items-center gap-2"><span className="text-indigo-600">✓</span> Active Conflict Resolution</div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-slate-400 font-mono tracking-wide">
          SECURE PRODUCTION RUNTIME // V2
        </div>
      </div>

      {/* Controls Authentication Canvas */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-xs space-y-5">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">System Entry Gate</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Verify credentials to establish secure instance hooks.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-3 rounded-md transition-all active:scale-[0.99] disabled:opacity-40 shadow-sm"
          >
            {loading ? (
              <span className="text-slate-400 font-medium animate-pulse">Requesting secure state...</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.77z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 5 12c0-.79.13-1.57.32-2.34V6.51H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-[10px] text-slate-400 leading-relaxed font-mono shadow-sm">
            🔒 SESSION PROTOCOL: Handshake routines leverage ephemeral parameters. Storage tokens clear cleanly upon window disposal metrics.
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;